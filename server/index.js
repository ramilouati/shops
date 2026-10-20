import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import {
  COOKIE_CUSTOMER,
  COOKIE_TEAM,
  TEAM_ROLES,
  cookieOptions,
  createSession,
  destroySession,
  ensureAuthTables,
  hashPassword,
  publicUser,
  readCookie,
  userFromSession,
  verifyPassword,
} from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = process.env.SQLITE_PATH || path.join(__dirname, "data", "tunishop.db");
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const db = new DatabaseSync(dbFile);
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    price_old REAL,
    category TEXT,
    img_src TEXT,
    stock INTEGER NOT NULL DEFAULT 10,
    section TEXT,
    filter_category TEXT
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    notes TEXT,
    payment TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'nouvelle',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );
`);

const columns = db.prepare("PRAGMA table_info(products)").all().map((column) => column.name);
if (!columns.includes("section")) db.exec("ALTER TABLE products ADD COLUMN section TEXT");
if (!columns.includes("filter_category")) {
  db.exec("ALTER TABLE products ADD COLUMN filter_category TEXT");
}

const catalog = [
  { id: 5001, title: "Veste courte en simili cuir", price: 189, category: "Vestes", imgSrc: "/assets/images/home/demo5/product-0-1.jpg", stock: 12, section: "collection", filterCategory: "En vedette" },
  { id: 5002, title: "Short Calvin", price: 79, category: "Pantalons", imgSrc: "/assets/images/home/demo5/product-1-1.jpg", stock: 20, section: "collection", filterCategory: "En vedette" },
  { id: 5003, title: "T-shirt Kirby", price: 49, category: "T-shirts", imgSrc: "/assets/images/home/demo5/product-2-1.jpg", stock: 30, section: "collection", filterCategory: "Populaires" },
  { id: 5004, title: "Châle en maille torsadée", price: 119, priceOld: 159, category: "Accessoires", imgSrc: "/assets/images/home/demo5/product-3-1.jpg", stock: 8, section: "collection", filterCategory: "Populaires" },
  { id: 5005, title: "Chemise imprimé guépard", price: 109, priceOld: 149, category: "Chemises", imgSrc: "/assets/images/home/demo5/product-4-1.jpg", stock: 10, section: "collection", filterCategory: "Mieux notés" },
  { id: 5201, title: "Robe midi plissée", price: 139, category: "Robes", imgSrc: "/assets/images/home/demo5/product-5-1.jpg", stock: 9, section: "bestseller", filterCategory: "En vedette" },
  { id: 5202, title: "Pull col roulé en laine", price: 119, category: "Pulls", imgSrc: "/assets/images/home/demo5/product-6-1.jpg", stock: 14, section: "bestseller", filterCategory: "En vedette" },
  { id: 5203, title: "Baskets en cuir blanc", price: 199, category: "Chaussures", imgSrc: "/assets/images/home/demo5/product-7-1.jpg", stock: 7, section: "bestseller", filterCategory: "En vedette" },
  { id: 5204, title: "Sac cabas en cuir", price: 229, priceOld: 299, category: "Sacs", imgSrc: "/assets/images/home/demo5/product-8-1.jpg", stock: 6, section: "bestseller", filterCategory: "En vedette" },
  { id: 5301, title: "Veste courte en simili cuir", price: 129, category: "Offres", imgSrc: "/assets/images/home/demo5/product-10-1.jpg", stock: 5, section: "deal", filterCategory: "En vedette" },
  { id: 5302, title: "Short Calvin", price: 59, category: "Offres", imgSrc: "/assets/images/home/demo5/product-11-1.jpg", stock: 11, section: "deal", filterCategory: "En vedette" },
  { id: 5303, title: "T-shirt Kirby", price: 35, category: "Offres", imgSrc: "/assets/images/home/demo5/product-12-1.jpg", stock: 15, section: "deal", filterCategory: "En vedette" },
  { id: 5304, title: "Châle en maille torsadée", price: 89, category: "Offres", imgSrc: "/assets/images/home/demo5/product-13-1.jpg", stock: 8, section: "deal", filterCategory: "En vedette" },
];

const count = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
if (count === 0) {
  const insert = db.prepare(
    "INSERT INTO products (id, title, price, price_old, category, img_src, stock, section, filter_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  for (const product of catalog) {
    insert.run(
      product.id,
      product.title,
      product.price,
      product.priceOld ?? null,
      product.category,
      product.imgSrc,
      product.stock,
      product.section,
      product.filterCategory
    );
  }
}
db.exec(`
  UPDATE products SET section = 'bestseller' WHERE section IS NULL AND id BETWEEN 5200 AND 5299;
  UPDATE products SET section = 'deal' WHERE section IS NULL AND id BETWEEN 5300 AND 5399;
  UPDATE products SET section = 'collection' WHERE section IS NULL;
  UPDATE products SET filter_category = 'En vedette' WHERE filter_category IS NULL AND id IN (5001, 5002);
  UPDATE products SET filter_category = 'Populaires' WHERE filter_category IS NULL AND id IN (5003, 5004);
  UPDATE products SET filter_category = 'Mieux notés' WHERE filter_category IS NULL AND id = 5005;
  UPDATE products SET filter_category = 'En vedette' WHERE filter_category IS NULL;
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS coupons (
    code TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    amount REAL NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
  );
`);
const saveSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
saveSetting.run("delivery_fee", "7");
saveSetting.run("free_from", "200");
saveSetting.run("whatsapp_phone", "21620000000");
db.prepare("INSERT OR IGNORE INTO coupons (code, kind, amount, active) VALUES ('BIENVENUE', 'percent', 10, 1)").run();
const orderColumns = db.prepare("PRAGMA table_info(orders)").all().map((column) => column.name);
if (!orderColumns.includes("discount")) db.exec("ALTER TABLE orders ADD COLUMN discount REAL DEFAULT 0");
if (!orderColumns.includes("shipping")) db.exec("ALTER TABLE orders ADD COLUMN shipping REAL DEFAULT 0");
if (!orderColumns.includes("coupon")) db.exec("ALTER TABLE orders ADD COLUMN coupon TEXT");
if (!orderColumns.includes("user_id")) db.exec("ALTER TABLE orders ADD COLUMN user_id INTEGER");

ensureAuthTables(db);

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    src TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS stock_moves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    delta INTEGER NOT NULL,
    stock_after INTEGER NOT NULL,
    reason TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL
  );
`);
const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
for (const row of db.prepare("SELECT DISTINCT category AS name FROM products WHERE category IS NOT NULL AND trim(category) != ''").all()) {
  insertCategory.run(row.name);
}
const missingImages = db.prepare(`
  SELECT id, img_src AS imgSrc FROM products
  WHERE id NOT IN (SELECT product_id FROM product_images) AND img_src IS NOT NULL
`).all();
const insertImage = db.prepare("INSERT INTO product_images (product_id, src, position) VALUES (?, ?, 0)");
for (const row of missingImages) insertImage.run(row.id, row.imgSrc);

const uploadsDir = path.join(__dirname, "..", "public", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const productSql =
  "SELECT id, title, price, price_old AS priceOld, category, img_src AS imgSrc, stock, section, filter_category AS filterCategory FROM products";

const withImages = (product) => {
  if (!product) return null;
  const images = db
    .prepare("SELECT src FROM product_images WHERE product_id = ? ORDER BY position, id")
    .all(product.id)
    .map((row) => row.src);
  return { ...product, images, imgSrc: images[0] || product.imgSrc, imgSrc2: images[1] || null };
};

const recordStock = (productId, delta, reason, note = "") => {
  const product = db.prepare("SELECT id, stock FROM products WHERE id = ?").get(productId);
  if (!product) return { error: "Produit introuvable" };
  if (!Number.isInteger(delta) || delta === 0) return { error: "Quantité invalide." };
  const next = product.stock + delta;
  if (next < 0) return { error: "Le stock ne peut pas passer sous zéro." };
  db.prepare("UPDATE products SET stock = ? WHERE id = ?").run(next, productId);
  db.prepare(
    "INSERT INTO stock_moves (product_id, delta, stock_after, reason, note, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(productId, delta, next, reason, note, new Date().toISOString());
  return { stock: next };
};

const saveUploadedImages = (productId, images) => {
  if (!Array.isArray(images) || images.length < 1 || images.length > 4) {
    return { error: "Choisissez entre 1 et 4 photos." };
  }
  const saved = [];
  for (const [index, image] of images.entries()) {
    const match = String(image).match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/);
    if (!match) return { error: "Photo invalide. Utilisez JPG, PNG ou WebP." };
    const ext = match[1] === "image/png" ? "png" : match[1] === "image/webp" ? "webp" : "jpg";
    const buffer = Buffer.from(match[2].replace(/\s/g, ""), "base64");
    if (!buffer.length || buffer.length > 2_000_000) return { error: "Chaque photo doit faire moins de 2 Mo." };
    const filename = `${productId}-${Date.now()}-${index}.${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    saved.push(`/uploads/${filename}`);
  }
  db.prepare("DELETE FROM product_images WHERE product_id = ?").run(productId);
  const insert = db.prepare("INSERT INTO product_images (product_id, src, position) VALUES (?, ?, ?)");
  saved.forEach((src, position) => insert.run(productId, src, position));
  db.prepare("UPDATE products SET img_src = ? WHERE id = ?").run(saved[0], productId);
  return { images: saved };
};

const knownCategory = (name) => db.prepare("SELECT name FROM categories WHERE name = ?").get(name);

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 12_000_000) reject(new Error("Payload too large"));
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });

const teamUser = (req) => userFromSession(db, readCookie(req, COOKIE_TEAM), "team");
const customerUser = (req) => userFromSession(db, readCookie(req, COOKIE_CUSTOMER), "customer");
const isAdmin = (req) => {
  const user = teamUser(req);
  return !!user && TEAM_ROLES.includes(user.role);
};
const isFullAdmin = (req) => teamUser(req)?.role === "admin";

const setAuthCookie = (res, req, name, token, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Set-Cookie": `${name}=${encodeURIComponent(token)}; ${cookieOptions(req)}`,
  });
  res.end(JSON.stringify(payload));
};

const clearAuthCookie = (res, req, name, payload = { ok: true }) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Set-Cookie": `${name}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
  });
  res.end(JSON.stringify(payload));
};

const send = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
};

const getSettings = () => ({
  deliveryFee: Number(db.prepare("SELECT value FROM settings WHERE key = 'delivery_fee'").get()?.value) || 0,
  freeFrom: Number(db.prepare("SELECT value FROM settings WHERE key = 'free_from'").get()?.value) || 0,
  whatsappPhone: db.prepare("SELECT value FROM settings WHERE key = 'whatsapp_phone'").get()?.value || "21620000000",
});

const replyTo = (message) => {
  const text = String(message || "").trim().toLowerCase();
  const settings = getSettings();
  if (!text) return "Écrivez un article, « catalogue », « livraison », ou un numéro TS-1001 avec le téléphone.";
  const orderNumber = text.match(/ts-\d+/);
  if (orderNumber) {
    const row = db.prepare("SELECT number, status, total, phone FROM orders WHERE lower(number) = ?").get(orderNumber[0]);
    if (!row) return "Je ne trouve pas cette commande.";
    const digits = text.replace(orderNumber[0], "").replace(/\D/g, "");
    if (!digits) return `Commande ${row.number.toUpperCase()} trouvée. Ajoutez le téléphone utilisé à l’achat.`;
    if (!String(row.phone).replace(/\D/g, "").endsWith(digits) && !digits.endsWith(String(row.phone).replace(/\D/g, ""))) {
      return "Le téléphone ne correspond pas à cette commande.";
    }
    return `Commande ${row.number} : ${row.status}. Total ${row.total} TND.`;
  }
  if (["bonjour", "salut", "menu", "aide", "hello"].some((word) => text === word || text.startsWith(`${word} `))) {
    return "Bonjour, je suis l’assistant TuniShop. Je peux donner le catalogue, le prix d’un article, les frais de livraison, les codes promo, ou le suivi d’une commande.";
  }
  if (text.includes("livraison") || text.includes("frais") || text.includes("port")) {
    return `La livraison coûte ${settings.deliveryFee} TND. Elle est offerte dès ${settings.freeFrom} TND.`;
  }
  if (text.includes("promo") || text.includes("code") || text.includes("reduction") || text.includes("réduction")) {
    const coupons = db.prepare("SELECT code, kind, amount FROM coupons WHERE active = 1 ORDER BY code").all();
    if (!coupons.length) return "Aucun code promo en ce moment.";
    return coupons.map((coupon) => `${coupon.code} : ${coupon.kind === "percent" ? `${coupon.amount} %` : `${coupon.amount} TND`}`).join("\n");
  }
  if (text.includes("whatsapp") || text.includes("horaire") || text.includes("contact")) {
    return `WhatsApp : +${settings.whatsappPhone}. Nous répondons du lundi au samedi, de 9h à 19h.`;
  }
  if (text.includes("suivi")) return "Envoyez le numéro de commande et le téléphone, par exemple TS-1001 20000000.";
  const products = db.prepare("SELECT title, price, stock FROM products ORDER BY title").all();
  if (text.includes("catalogue") || text.includes("boutique") || text === "prix") {
    const lines = products.slice(0, 8).map((product) => `${product.title} — ${product.price} TND${product.stock < 1 ? " (rupture)" : ""}`);
    return lines.join("\n") + (products.length > 8 ? "\nDemandez un article pour le détail." : "");
  }
  const hit = products.find(
    (product) => text.includes(product.title.toLowerCase()) || product.title.toLowerCase().includes(text)
  );
  if (!hit) return "Je n’ai pas trouvé cet article. Écrivez « catalogue » ou le début du nom.";
  if (hit.stock < 1) return `${hit.title} est en rupture de stock.`;
  return `${hit.title} coûte ${hit.price} TND. Il en reste ${hit.stock}.`;
};

const parseCsv = (source) => {
  const text = String(source || "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const headerLine = text.split("\n").find((line) => line.trim()) || "";
  const delimiter = (headerLine.match(/;/g) || []).length > (headerLine.match(/,/g) || []).length ? ";" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) {
      row.push(cell.trim());
      cell = "";
    } else if (char === "\n") {
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (cell || row.length) {
    row.push(cell.trim());
    if (row.some(Boolean)) rows.push(row);
  }
  return rows;
};

const buildLines = (items) => {
  if (!Array.isArray(items) || !items.length) return { error: "Le panier est vide." };
  const lines = [];
  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return { error: "Quantité invalide." };
    }
    const product = item.productId
      ? db.prepare("SELECT * FROM products WHERE id = ?").get(Number(item.productId))
      : null;
    if (product) {
      if (product.stock < quantity) return { error: `Stock insuffisant pour ${product.title}.` };
      lines.push({ productId: product.id, title: product.title, price: product.price, quantity });
    } else {
      const price = Number(item.price);
      const title = String(item.title || "").trim();
      if (!title || !Number.isFinite(price) || price <= 0) return { error: "Article invalide." };
      lines.push({ productId: null, title, price, quantity });
    }
  }
  return { lines };
};

const quoteOrder = (lines, couponCode) => {
  const settings = getSettings();
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const code = String(couponCode || "").trim().toUpperCase();
  let discount = 0;
  if (code) {
    const coupon = db.prepare("SELECT * FROM coupons WHERE code = ? AND active = 1").get(code);
    if (!coupon) return { error: "Code promo invalide." };
    discount = coupon.kind === "percent" ? (subtotal * coupon.amount) / 100 : Math.min(subtotal, coupon.amount);
  }
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = afterDiscount >= settings.freeFrom ? 0 : settings.deliveryFee;
  return {
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
    coupon: code,
    freeFrom: settings.freeFrom,
    deliveryFee: settings.deliveryFee,
  };
};

const orderWithItems = (row) => {
  if (!row) return null;
  const items = db
    .prepare(
      "SELECT product_id AS productId, title, price, quantity FROM order_items WHERE order_id = ?"
    )
    .all(row.id);
  return {
    number: row.number,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    city: row.city,
    notes: row.notes,
    payment: row.payment,
    subtotal: row.total - (row.shipping || 0) + (row.discount || 0),
    discount: row.discount || 0,
    shipping: row.shipping || 0,
    coupon: row.coupon || "",
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
    items,
  };
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  try {
    const adminOnly =
      url.pathname === "/api/stats" ||
      url.pathname === "/api/products/import" ||
      (url.pathname === "/api/products" && req.method !== "GET") ||
      (/^\/api\/products\/\d+$/.test(url.pathname) && req.method !== "GET") ||
      url.pathname.startsWith("/api/coupons") ||
      url.pathname.startsWith("/api/stock") ||
      url.pathname.startsWith("/api/users") ||
      (url.pathname.startsWith("/api/categories") && req.method !== "GET") ||
      (url.pathname === "/api/settings" && req.method !== "GET") ||
      (url.pathname === "/api/orders" && req.method === "GET") ||
      (/^\/api\/orders\/TS-\d+$/i.test(url.pathname) && req.method === "PATCH");
    if (adminOnly && !isAdmin(req)) {
      send(res, 401, { error: "Connexion requise." });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/login") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const user = db.prepare("SELECT * FROM users WHERE lower(email) = ?").get(email);
      if (!user || !user.active || !TEAM_ROLES.includes(user.role) || !verifyPassword(password, user.password_hash)) {
        send(res, 401, { error: "E-mail ou mot de passe incorrect." });
        return;
      }
      destroySession(db, readCookie(req, COOKIE_TEAM));
      const session = createSession(db, user.id, "team");
      setAuthCookie(res, req, COOKIE_TEAM, session.token, 200, { ok: true, user: publicUser(user) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/logout") {
      destroySession(db, readCookie(req, COOKIE_TEAM));
      clearAuthCookie(res, req, COOKIE_TEAM);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/me") {
      const user = teamUser(req);
      if (!user) return send(res, 401, { error: "Connexion requise." });
      send(res, 200, { user: publicUser(user) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/register") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const name = String(body.name || "").trim();
      const phone = String(body.phone || "").replace(/\D/g, "");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6 || name.length < 2) {
        send(res, 400, { error: "Nom, e-mail valide et mot de passe (6 caractères min.) sont requis." });
        return;
      }
      try {
        const result = db
          .prepare(
            "INSERT INTO users (email, password_hash, name, phone, role, active, created_at) VALUES (?, ?, ?, ?, 'customer', 1, ?)"
          )
          .run(email, hashPassword(password), name, phone, new Date().toISOString());
        const session = createSession(db, Number(result.lastInsertRowid), "customer");
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(result.lastInsertRowid));
        setAuthCookie(res, req, COOKIE_CUSTOMER, session.token, 201, { ok: true, user: publicUser(user) });
      } catch {
        send(res, 400, { error: "Cet e-mail est déjà utilisé." });
      }
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/customer/login") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const user = db.prepare("SELECT * FROM users WHERE lower(email) = ?").get(email);
      if (!user || !user.active || user.role !== "customer" || !verifyPassword(password, user.password_hash)) {
        send(res, 401, { error: "E-mail ou mot de passe incorrect." });
        return;
      }
      destroySession(db, readCookie(req, COOKIE_CUSTOMER));
      const session = createSession(db, user.id, "customer");
      setAuthCookie(res, req, COOKIE_CUSTOMER, session.token, 200, { ok: true, user: publicUser(user) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/customer/logout") {
      destroySession(db, readCookie(req, COOKIE_CUSTOMER));
      clearAuthCookie(res, req, COOKIE_CUSTOMER);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/customer/me") {
      const user = customerUser(req);
      if (!user) return send(res, 401, { error: "Connexion requise." });
      const wishlist = db
        .prepare("SELECT product_id AS id FROM wishlists WHERE user_id = ? ORDER BY created_at DESC")
        .all(user.id)
        .map((row) => row.id);
      send(res, 200, { user: publicUser(user), wishlist });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/customer/orders") {
      const user = customerUser(req);
      if (!user) return send(res, 401, { error: "Connexion requise." });
      const rows = db
        .prepare("SELECT * FROM orders WHERE user_id = ? OR (user_id IS NULL AND phone = ?) ORDER BY id DESC")
        .all(user.id, user.phone || "__none__");
      send(res, 200, rows.map(orderWithItems));
      return;
    }

    if (req.method === "PUT" && url.pathname === "/api/customer/wishlist") {
      const user = customerUser(req);
      if (!user) return send(res, 401, { error: "Connexion requise." });
      const body = await readBody(req);
      const ids = Array.isArray(body.productIds)
        ? [...new Set(body.productIds.map(Number).filter((id) => Number.isInteger(id) && id > 0))]
        : [];
      db.exec("BEGIN");
      try {
        db.prepare("DELETE FROM wishlists WHERE user_id = ?").run(user.id);
        const insert = db.prepare(
          "INSERT INTO wishlists (user_id, product_id, created_at) VALUES (?, ?, ?)"
        );
        const now = new Date().toISOString();
        for (const id of ids) insert.run(user.id, id, now);
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      send(res, 200, { wishlist: ids });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/users") {
      if (!isFullAdmin(req)) return send(res, 403, { error: "Réservé à l’administrateur." });
      send(
        res,
        200,
        db
          .prepare(
            "SELECT id, email, name, phone, role, active, created_at AS createdAt FROM users ORDER BY role, name"
          )
          .all()
          .map((row) => ({ ...row, active: !!row.active }))
      );
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/users") {
      if (!isFullAdmin(req)) return send(res, 403, { error: "Réservé à l’administrateur." });
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const name = String(body.name || "").trim();
      const phone = String(body.phone || "").replace(/\D/g, "");
      const role = ["admin", "staff", "customer"].includes(body.role) ? body.role : "";
      if (!role || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6 || name.length < 2) {
        send(res, 400, { error: "Nom, e-mail, rôle et mot de passe (6 min.) sont requis." });
        return;
      }
      try {
        const result = db
          .prepare(
            "INSERT INTO users (email, password_hash, name, phone, role, active, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)"
          )
          .run(email, hashPassword(password), name, phone, role, new Date().toISOString());
        send(res, 201, publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(Number(result.lastInsertRowid))));
      } catch {
        send(res, 400, { error: "Cet e-mail est déjà utilisé." });
      }
      return;
    }

    const userMatch = url.pathname.match(/^\/api\/users\/(\d+)$/);
    if (userMatch && req.method === "PATCH") {
      if (!isFullAdmin(req)) return send(res, 403, { error: "Réservé à l’administrateur." });
      const id = Number(userMatch[1]);
      const current = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
      if (!current) return send(res, 404, { error: "Utilisateur introuvable" });
      const body = await readBody(req);
      const name = String(body.name ?? current.name).trim();
      const phone = String(body.phone ?? current.phone ?? "").replace(/\D/g, "");
      const role = ["admin", "staff", "customer"].includes(body.role) ? body.role : current.role;
      const active = body.active == null ? current.active : body.active ? 1 : 0;
      if (current.role === "admin" && (role !== "admin" || !active)) {
        const admins = db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND active = 1").get().n;
        if (admins <= 1) return send(res, 400, { error: "Il doit rester au moins un administrateur actif." });
      }
      if (name.length < 2) return send(res, 400, { error: "Nom invalide." });
      if (body.password) {
        if (String(body.password).length < 6) return send(res, 400, { error: "Mot de passe trop court." });
        db.prepare(
          "UPDATE users SET name = ?, phone = ?, role = ?, active = ?, password_hash = ? WHERE id = ?"
        ).run(name, phone, role, active, hashPassword(body.password), id);
      } else {
        db.prepare("UPDATE users SET name = ?, phone = ?, role = ?, active = ? WHERE id = ?").run(
          name,
          phone,
          role,
          active,
          id
        );
      }
      send(res, 200, publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id)));
      return;
    }

    if (userMatch && req.method === "DELETE") {
      if (!isFullAdmin(req)) return send(res, 403, { error: "Réservé à l’administrateur." });
      const id = Number(userMatch[1]);
      const current = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
      if (!current) return send(res, 404, { error: "Utilisateur introuvable" });
      if (teamUser(req)?.id === id) return send(res, 400, { error: "Vous ne pouvez pas supprimer votre propre compte." });
      if (current.role === "admin") {
        const admins = db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND active = 1").get().n;
        if (admins <= 1) return send(res, 400, { error: "Il doit rester au moins un administrateur." });
      }
      db.prepare("DELETE FROM sessions WHERE user_id = ?").run(id);
      db.prepare("DELETE FROM wishlists WHERE user_id = ?").run(id);
      db.prepare("DELETE FROM users WHERE id = ?").run(id);
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/admin")) {
      const shopUrl = process.env.SHOP_URL || "http://localhost:5173/";
      const html = fs.readFileSync(path.join(__dirname, "admin.html"), "utf8").replaceAll(
        "http://localhost:5173/",
        shopUrl
      );
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/uploads/")) {
      const file = path.join(uploadsDir, path.basename(url.pathname));
      if (!fs.existsSync(file)) return send(res, 404, { error: "Not found" });
      const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
      res.writeHead(200, { "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
      res.end(fs.readFileSync(file));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/health") {
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/stats") {
      const summary = db
        .prepare(
          `SELECT
             COUNT(*) AS orders,
             SUM(CASE WHEN status != 'annulée' THEN 1 ELSE 0 END) AS activeOrders,
             COALESCE(SUM(CASE WHEN status != 'annulée' THEN total ELSE 0 END), 0) AS revenue,
             COUNT(DISTINCT CASE WHEN status != 'annulée' THEN phone END) AS customers
           FROM orders`
        )
        .get();
      const byDay = Object.fromEntries(
        db
          .prepare(
            `SELECT substr(created_at, 1, 10) AS day,
                    COUNT(*) AS orders,
                    COALESCE(SUM(CASE WHEN status != 'annulée' THEN total ELSE 0 END), 0) AS revenue
             FROM orders
             GROUP BY day`
          )
          .all()
          .map((row) => [row.day, row])
      );
      const days = [];
      for (let i = 6; i >= 0; i -= 1) {
        const day = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
        days.push({
          day,
          orders: byDay[day]?.orders || 0,
          revenue: byDay[day]?.revenue || 0,
        });
      }
      send(res, 200, {
        revenue: summary.revenue,
        orders: summary.orders,
        activeOrders: summary.activeOrders || 0,
        customers: summary.customers || 0,
        average: summary.activeOrders ? summary.revenue / summary.activeOrders : 0,
        byStatus: db
          .prepare(
            "SELECT status, COUNT(*) AS count, COALESCE(SUM(total), 0) AS total FROM orders GROUP BY status"
          )
          .all(),
        days,
        topProducts: db
          .prepare(
            `SELECT oi.title,
                    SUM(oi.quantity) AS quantity,
                    SUM(oi.price * oi.quantity) AS revenue
             FROM order_items oi
             JOIN orders o ON o.id = oi.order_id
             WHERE o.status != 'annulée'
             GROUP BY oi.title
             ORDER BY revenue DESC
             LIMIT 5`
          )
          .all(),
        lowStock: db
          .prepare(
            "SELECT id, title, stock, category FROM products WHERE stock <= 5 ORDER BY stock ASC, title"
          )
          .all(),
        catalog: db
          .prepare(
            `SELECT COUNT(*) AS products,
                    COALESCE(SUM(price * stock), 0) AS stockValue,
                    COALESCE(SUM(stock), 0) AS units,
                    SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) AS outOfStock,
                    SUM(CASE WHEN stock > 0 AND stock <= 5 THEN 1 ELSE 0 END) AS low
             FROM products`
          )
          .get(),
        cancelled: db.prepare("SELECT COUNT(*) AS n FROM orders WHERE status = 'annulée'").get().n,
        repeatCustomers: db
          .prepare(
            `SELECT COUNT(*) AS n FROM (
               SELECT phone FROM orders WHERE status != 'annulée' GROUP BY phone HAVING COUNT(*) > 1
             )`
          )
          .get().n,
        itemsSold: db
          .prepare(
            `SELECT COALESCE(SUM(oi.quantity), 0) AS n
             FROM order_items oi JOIN orders o ON o.id = oi.order_id
             WHERE o.status != 'annulée'`
          )
          .get().n,
        discounts: db
          .prepare(
            `SELECT COALESCE(SUM(CASE WHEN status != 'annulée' THEN discount ELSE 0 END), 0) AS discount,
                    COALESCE(SUM(CASE WHEN status != 'annulée' THEN shipping ELSE 0 END), 0) AS shipping,
                    SUM(CASE WHEN status != 'annulée' AND COALESCE(shipping, 0) = 0 THEN 1 ELSE 0 END) AS freeDeliveries
             FROM orders`
          )
          .get(),
        byCity: db
          .prepare(
            `SELECT city, COUNT(*) AS orders, COALESCE(SUM(total), 0) AS revenue
             FROM orders WHERE status != 'annulée'
             GROUP BY city ORDER BY revenue DESC LIMIT 8`
          )
          .all(),
        byPayment: db
          .prepare(
            `SELECT payment, COUNT(*) AS orders, COALESCE(SUM(total), 0) AS revenue
             FROM orders WHERE status != 'annulée'
             GROUP BY payment ORDER BY revenue DESC`
          )
          .all(),
        byCoupon: db
          .prepare(
            `SELECT coupon, COUNT(*) AS orders, COALESCE(SUM(discount), 0) AS discount, COALESCE(SUM(total), 0) AS revenue
             FROM orders
             WHERE status != 'annulée' AND coupon IS NOT NULL AND trim(coupon) != ''
             GROUP BY coupon ORDER BY orders DESC`
          )
          .all(),
        byCategory: db
          .prepare(
            `SELECT COALESCE(p.category, 'Sans catégorie') AS category,
                    SUM(oi.quantity) AS quantity,
                    SUM(oi.price * oi.quantity) AS revenue
             FROM order_items oi
             JOIN orders o ON o.id = oi.order_id
             LEFT JOIN products p ON p.id = oi.product_id
             WHERE o.status != 'annulée'
             GROUP BY category
             ORDER BY revenue DESC`
          )
          .all(),
        stockByCategory: db
          .prepare(
            `SELECT COALESCE(category, 'Sans catégorie') AS category,
                    COUNT(*) AS products,
                    COALESCE(SUM(stock), 0) AS units,
                    SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) AS outOfStock,
                    COALESCE(SUM(price * stock), 0) AS value
             FROM products
             GROUP BY category
             ORDER BY value DESC`
          )
          .all(),
        unsold: db
          .prepare(
            `SELECT p.id, p.title, p.category, p.stock
             FROM products p
             WHERE NOT EXISTS (
               SELECT 1 FROM order_items oi
               JOIN orders o ON o.id = oi.order_id
               WHERE oi.product_id = p.id AND o.status != 'annulée'
             )
             ORDER BY p.stock DESC, p.title
             LIMIT 20`
          )
          .all(),
        weeks: db
          .prepare(
            `SELECT CAST((julianday('now') - julianday(created_at)) / 7 AS INTEGER) AS weeksAgo,
                    COUNT(*) AS orders,
                    COALESCE(SUM(CASE WHEN status != 'annulée' THEN total ELSE 0 END), 0) AS revenue
             FROM orders
             WHERE julianday(created_at) >= julianday('now', '-28 days')
             GROUP BY weeksAgo`
          )
          .all(),
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/settings") {
      send(res, 200, getSettings());
      return;
    }

    if (req.method === "PATCH" && url.pathname === "/api/settings") {
      const body = await readBody(req);
      const deliveryFee = Number(body.deliveryFee);
      const freeFrom = Number(body.freeFrom);
      const whatsappPhone = String(body.whatsappPhone || "").replace(/\D/g, "");
      if (!Number.isFinite(deliveryFee) || deliveryFee < 0 || !Number.isFinite(freeFrom) || freeFrom < 0) {
        send(res, 400, { error: "Frais de livraison invalides." });
        return;
      }
      if (!/^\d{8,15}$/.test(whatsappPhone)) {
        send(res, 400, { error: "Numéro WhatsApp invalide. Exemple : 21620000000." });
        return;
      }
      const update = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
      update.run("delivery_fee", String(deliveryFee));
      update.run("free_from", String(freeFrom));
      update.run("whatsapp_phone", whatsappPhone);
      send(res, 200, getSettings());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/coupons") {
      send(res, 200, db.prepare("SELECT code, kind, amount, active FROM coupons ORDER BY code").all());
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/coupons") {
      const body = await readBody(req);
      const code = String(body.code || "").trim().toUpperCase();
      const amount = Number(body.amount);
      const kind = body.kind === "fixed" ? "fixed" : "percent";
      if (!/^[A-Z0-9-]{3,20}$/.test(code) || !Number.isFinite(amount) || amount <= 0 || (kind === "percent" && amount > 100)) {
        send(res, 400, { error: "Code ou réduction invalide." });
        return;
      }
      db.prepare("INSERT INTO coupons (code, kind, amount, active) VALUES (?, ?, ?, 1) ON CONFLICT(code) DO UPDATE SET kind = excluded.kind, amount = excluded.amount, active = 1").run(code, kind, amount);
      send(res, 201, { code, kind, amount, active: 1 });
      return;
    }

    const couponMatch = url.pathname.match(/^\/api\/coupons\/([A-Za-z0-9-]+)$/);
    if (couponMatch && req.method === "DELETE") {
      db.prepare("DELETE FROM coupons WHERE code = ?").run(couponMatch[1].toUpperCase());
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/quote") {
      const body = await readBody(req);
      const built = buildLines(body.items);
      if (built.error) return send(res, 400, built);
      const quote = quoteOrder(built.lines, body.coupon);
      if (quote.error) return send(res, 400, quote);
      send(res, 200, quote);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/categories") {
      send(res, 200, db.prepare("SELECT id, name FROM categories ORDER BY name").all());
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/categories") {
      const body = await readBody(req);
      const name = String(body.name || "").trim();
      if (name.length < 2 || name.length > 40) {
        send(res, 400, { error: "Le nom de catégorie doit faire entre 2 et 40 caractères." });
        return;
      }
      try {
        const result = db.prepare("INSERT INTO categories (name) VALUES (?)").run(name);
        send(res, 201, { id: Number(result.lastInsertRowid), name });
      } catch {
        send(res, 400, { error: "Cette catégorie existe déjà." });
      }
      return;
    }

    const categoryMatch = url.pathname.match(/^\/api\/categories\/(\d+)$/);
    if (categoryMatch && req.method === "PATCH") {
      const body = await readBody(req);
      const name = String(body.name || "").trim();
      const current = db.prepare("SELECT * FROM categories WHERE id = ?").get(Number(categoryMatch[1]));
      if (!current) return send(res, 404, { error: "Catégorie introuvable" });
      if (name.length < 2 || name.length > 40) return send(res, 400, { error: "Nom invalide." });
      try {
        db.prepare("UPDATE categories SET name = ? WHERE id = ?").run(name, current.id);
        db.prepare("UPDATE products SET category = ? WHERE category = ?").run(name, current.name);
        send(res, 200, { id: current.id, name });
      } catch {
        send(res, 400, { error: "Cette catégorie existe déjà." });
      }
      return;
    }

    if (categoryMatch && req.method === "DELETE") {
      const current = db.prepare("SELECT * FROM categories WHERE id = ?").get(Number(categoryMatch[1]));
      if (!current) return send(res, 404, { error: "Catégorie introuvable" });
      const used = db.prepare("SELECT COUNT(*) AS n FROM products WHERE category = ?").get(current.name).n;
      if (used) return send(res, 400, { error: "Des articles utilisent encore cette catégorie." });
      db.prepare("DELETE FROM categories WHERE id = ?").run(current.id);
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/stock") {
      const products = db.prepare(`${productSql} ORDER BY stock ASC, title`).all().map(withImages);
      const moves = db.prepare(`
        SELECT m.id, m.product_id AS productId, p.title, m.delta, m.stock_after AS stockAfter, m.reason, m.note, m.created_at AS createdAt
        FROM stock_moves m JOIN products p ON p.id = m.product_id
        ORDER BY m.id DESC LIMIT 40
      `).all();
      send(res, 200, { products, moves });
      return;
    }

    const stockMatch = url.pathname.match(/^\/api\/stock\/(\d+)$/);
    if (stockMatch && req.method === "POST") {
      const body = await readBody(req);
      const delta = Number(body.delta);
      const reasons = ["réception", "correction", "casse", "inventaire"];
      const reason = reasons.includes(body.reason) ? body.reason : "";
      if (!reason) return send(res, 400, { error: "Choisissez un motif." });
      const result = recordStock(Number(stockMatch[1]), delta, reason, String(body.note || "").trim());
      if (result.error) return send(res, 400, result);
      send(res, 200, result);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/products") {
      send(res, 200, db.prepare(`${productSql} ORDER BY id`).all().map(withImages));
      return;
    }

    const productMatch = url.pathname.match(/^\/api\/products\/(\d+)$/);
    if (productMatch && req.method === "GET") {
      const product = db.prepare(`${productSql} WHERE id = ?`).get(Number(productMatch[1]));
      if (!product) return send(res, 404, { error: "Produit introuvable" });
      send(res, 200, withImages(product));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/products/import") {
      const body = await readBody(req);
      const table = parseCsv(body.csv);
      if (table.length < 2) {
        send(res, 400, { error: "Ajoutez une ligne d’en-tête puis au moins un article." });
        return;
      }
      const header = table[0].map((name) =>
        name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, "_")
      );
      const column = (...names) => header.findIndex((name) => names.includes(name));
      const titleCol = column("nom", "title", "article", "produit");
      const priceCol = column("prix", "price");
      const stockCol = column("stock");
      const categoryCol = column("categorie", "category");
      const oldCol = column("ancien_prix", "prix_ancien", "priceold", "price_old");
      const sectionCol = column("rayon", "section");
      if (titleCol < 0 || priceCol < 0) {
        send(res, 400, { error: "Colonnes requises : nom, prix. Stock et categorie sont utiles." });
        return;
      }
      const sectionOf = (value) => {
        const text = String(value || "").toLowerCase();
        if (text.includes("vente") || text.includes("best")) return "bestseller";
        if (text.includes("offre") || text.includes("deal")) return "deal";
        return "collection";
      };
      const created = [];
      const updated = [];
      const errors = [];
      const findByTitle = db.prepare("SELECT id FROM products WHERE lower(title) = lower(?)");
      const insert = db.prepare(
        "INSERT INTO products (id, title, price, price_old, category, img_src, stock, section, filter_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      );
      const update = db.prepare(
        "UPDATE products SET price = ?, price_old = ?, category = ?, stock = ?, section = ? WHERE id = ?"
      );
      db.exec("BEGIN");
      try {
        for (let index = 1; index < table.length && index <= 300; index += 1) {
          const cells = table[index];
          const title = String(cells[titleCol] || "").trim();
          const price = Number(String(cells[priceCol] || "").replace(",", "."));
          const stock = stockCol < 0 || cells[stockCol] === "" ? 10 : Number(cells[stockCol]);
          if (!title || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
            errors.push({ line: index + 1, error: title ? "Prix ou stock invalide." : "Nom manquant." });
            continue;
          }
          const priceOld = oldCol >= 0 && cells[oldCol] ? Number(String(cells[oldCol]).replace(",", ".")) : null;
          const category = categoryCol >= 0 && cells[categoryCol] ? cells[categoryCol] : "Boutique";
          insertCategory.run(category);
          const section = sectionOf(sectionCol >= 0 ? cells[sectionCol] : "");
          const existing = findByTitle.get(title);
          if (existing) {
            const currentStock = db.prepare("SELECT stock FROM products WHERE id = ?").get(existing.id).stock;
            update.run(price, Number.isFinite(priceOld) ? priceOld : null, category, currentStock, section, existing.id);
            if (stock !== currentStock) recordStock(existing.id, stock - currentStock, "inventaire", "Import CSV");
            updated.push(title);
          } else {
            const id = db.prepare("SELECT COALESCE(MAX(id), 5000) + 1 AS id FROM products").get().id;
            insert.run(id, title, price, Number.isFinite(priceOld) ? priceOld : null, category, "/assets/images/home/demo5/product-0-1.jpg", 0, section, "En vedette");
            if (stock > 0) recordStock(id, stock, "inventaire", "Import CSV");
            created.push(title);
          }
        }
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      send(res, 200, { created: created.length, updated: updated.length, errors });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/products") {
      const body = await readBody(req);
      const title = String(body.title || "").trim();
      const price = Number(body.price);
      const stock = Number(body.stock);
      const category = String(body.category || "").trim();
      if (!title || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
        send(res, 400, { error: "Titre, prix et stock sont requis." });
        return;
      }
      if (!knownCategory(category)) {
        send(res, 400, { error: "Choisissez une catégorie existante." });
        return;
      }
      const id = db.prepare("SELECT COALESCE(MAX(id), 5000) + 1 AS id FROM products").get().id;
      const saved = saveUploadedImages(id, body.images);
      if (saved.error) return send(res, 400, saved);
      db.prepare(
        "INSERT INTO products (id, title, price, price_old, category, img_src, stock, section, filter_category) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)"
      ).run(
        id,
        title,
        price,
        body.priceOld ? Number(body.priceOld) : null,
        category,
        saved.images[0],
        ["collection", "bestseller", "deal"].includes(body.section) ? body.section : "collection",
        String(body.filterCategory || "En vedette").trim()
      );
      if (stock > 0) recordStock(id, stock, "réception", "Création de l’article");
      send(res, 201, withImages(db.prepare(`${productSql} WHERE id = ?`).get(id)));
      return;
    }

    if (productMatch && req.method === "PATCH") {
      const id = Number(productMatch[1]);
      const current = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
      if (!current) return send(res, 404, { error: "Produit introuvable" });
      const body = await readBody(req);
      const price = body.price == null ? current.price : Number(body.price);
      const category = String(body.category || current.category || "").trim();
      if (!Number.isFinite(price) || price <= 0) return send(res, 400, { error: "Prix invalide." });
      if (!knownCategory(category)) return send(res, 400, { error: "Choisissez une catégorie existante." });
      if (Array.isArray(body.images) && body.images.length) {
        const saved = saveUploadedImages(id, body.images);
        if (saved.error) return send(res, 400, saved);
      }
      db.prepare(
        `UPDATE products SET title = ?, price = ?, price_old = ?, category = ?, section = ?, filter_category = ? WHERE id = ?`
      ).run(
        String(body.title || current.title).trim(),
        price,
        body.priceOld == null || body.priceOld === "" ? current.price_old : Number(body.priceOld),
        category,
        body.section || current.section,
        String(body.filterCategory || current.filter_category || "En vedette").trim(),
        id
      );
      send(res, 200, withImages(db.prepare(`${productSql} WHERE id = ?`).get(id)));
      return;
    }

    if (productMatch && req.method === "DELETE") {
      const id = Number(productMatch[1]);
      const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
      if (!result.changes) return send(res, 404, { error: "Produit introuvable" });
      db.prepare("DELETE FROM product_images WHERE product_id = ?").run(id);
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/chat") {
      const body = await readBody(req);
      send(res, 200, { reply: replyTo(body.message) });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/orders") {
      const rows = db
        .prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 50")
        .all();
      send(res, 200, rows.map(orderWithItems));
      return;
    }

    const orderMatch = url.pathname.match(/^\/api\/orders\/(TS-\d+)$/i);
    if (req.method === "PATCH" && orderMatch) {
      const statuses = ["nouvelle", "confirmée", "expédiée", "livrée", "annulée"];
      const body = await readBody(req);
      if (!statuses.includes(body.status)) {
        send(res, 400, { error: "Statut invalide." });
        return;
      }
      const row = db.prepare("SELECT * FROM orders WHERE number = ?").get(orderMatch[1].toUpperCase());
      if (!row) return send(res, 404, { error: "Commande introuvable" });
      if (body.status === "annulée" && row.status !== "annulée") {
        const items = db.prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?").all(row.id);
        for (const item of items) {
          if (item.product_id) recordStock(item.product_id, item.quantity, "annulation", row.number);
        }
      }
      db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(body.status, row.id);
      send(res, 200, orderWithItems(db.prepare("SELECT * FROM orders WHERE id = ?").get(row.id)));
      return;
    }

    if (req.method === "GET" && orderMatch) {
      const row = db.prepare("SELECT * FROM orders WHERE number = ?").get(orderMatch[1].toUpperCase());
      const phone = url.searchParams.get("phone");
      if (!row || (phone && phone !== row.phone)) {
        return send(res, 404, { error: "Commande introuvable" });
      }
      send(res, 200, orderWithItems(row));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/orders") {
      const body = await readBody(req);
      const firstName = String(body.firstName || "").trim();
      const lastName = String(body.lastName || "").trim();
      const phone = String(body.phone || "").trim();
      const address = String(body.address || "").trim();
      const city = String(body.city || "").trim();
      if (!firstName || !lastName || !phone || !address || !city) {
        send(res, 400, { error: "Nom, téléphone, adresse et ville sont requis." });
        return;
      }
      const items = Array.isArray(body.items) ? body.items : [];
      const built = buildLines(items);
      if (built.error) return send(res, 400, built);
      const quote = quoteOrder(built.lines, body.coupon);
      if (quote.error) return send(res, 400, quote);
      const { lines } = built;
      const nextId = db
        .prepare(
          "SELECT COALESCE(MAX(CAST(SUBSTR(number, 4) AS INTEGER)), 1000) + 1 AS n FROM orders"
        )
        .get().n;
      const number = `TS-${nextId}`;
      const payment = ["cod", "whatsapp", "bank"].includes(body.payment)
        ? body.payment
        : "cod";
      const buyer = customerUser(req);

      db.exec("BEGIN");
      try {
        const result = db
          .prepare(
            `INSERT INTO orders
              (number, customer_name, phone, email, address, city, notes, payment, total, discount, shipping, coupon, status, created_at, user_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nouvelle', ?, ?)`
          )
          .run(
            number,
            `${firstName} ${lastName}`,
            phone,
            String(body.email || buyer?.email || "").trim(),
            address,
            city,
            String(body.notes || "").trim(),
            payment,
            quote.total,
            quote.discount,
            quote.shipping,
            quote.coupon,
            new Date().toISOString(),
            buyer?.id || null
          );
        const insertItem = db.prepare(
          "INSERT INTO order_items (order_id, product_id, title, price, quantity) VALUES (?, ?, ?, ?, ?)"
        );
        for (const line of lines) {
          insertItem.run(result.lastInsertRowid, line.productId, line.title, line.price, line.quantity);
          if (line.productId) {
            const moved = recordStock(line.productId, -line.quantity, "vente", number);
            if (moved.error) throw new Error(moved.error);
          }
        }
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }

      const row = db.prepare("SELECT * FROM orders WHERE number = ?").get(number);
      send(res, 201, orderWithItems(row));
      return;
    }

    send(res, 404, { error: "Not found" });
  } catch (error) {
    send(res, 500, { error: error.message || "Erreur serveur" });
  }
});

const port = Number(process.env.PORT) || 3001;
server.listen(port, "0.0.0.0", () => {
  console.log(`TuniShop API on http://localhost:${port}`);
});
