import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, "tunishop.db"));
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

const productSql =
  "SELECT id, title, price, price_old AS priceOld, category, img_src AS imgSrc, stock, section, filter_category AS filterCategory FROM products";

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new Error("Payload too large"));
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

const send = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
};

const replyTo = (message) => {
  const text = String(message || "").trim().toLowerCase();
  if (!text) return "Écrivez un produit, un numéro TS-1001, ou « catalogue ».";
  const orderNumber = text.match(/ts-\d+/);
  if (orderNumber) {
    const row = db
      .prepare("SELECT number, status, total FROM orders WHERE lower(number) = ?")
      .get(orderNumber[0]);
    if (!row) return "Je ne trouve pas cette commande.";
    return `Commande ${row.number} : ${row.status}. Total ${row.total} TND.`;
  }
  const products = db.prepare("SELECT title, price, stock FROM products ORDER BY title").all();
  if (["catalogue", "bonjour", "menu", "prix"].some((word) => text.includes(word))) {
    return products
      .map((product) => `${product.title} — ${product.price} TND, stock ${product.stock}`)
      .join("\n");
  }
  const hit = products.find(
    (product) =>
      text.includes(product.title.toLowerCase()) ||
      product.title.toLowerCase().includes(text)
  );
  if (!hit) return "Article introuvable. Écrivez « catalogue » pour la liste.";
  if (hit.stock < 1) return `${hit.title} est en rupture de stock.`;
  return `${hit.title} coûte ${hit.price} TND. Il en reste ${hit.stock}.`;
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
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/admin")) {
      const html = fs.readFileSync(path.join(__dirname, "admin.html"), "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/health") {
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/products") {
      send(res, 200, db.prepare(`${productSql} ORDER BY id`).all());
      return;
    }

    const productMatch = url.pathname.match(/^\/api\/products\/(\d+)$/);
    if (productMatch && req.method === "GET") {
      const product = db.prepare(`${productSql} WHERE id = ?`).get(Number(productMatch[1]));
      if (!product) return send(res, 404, { error: "Produit introuvable" });
      send(res, 200, product);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/products") {
      const body = await readBody(req);
      const title = String(body.title || "").trim();
      const price = Number(body.price);
      const stock = Number(body.stock);
      if (!title || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
        send(res, 400, { error: "Titre, prix et stock sont requis." });
        return;
      }
      const id = db.prepare("SELECT COALESCE(MAX(id), 5000) + 1 AS id FROM products").get().id;
      db.prepare(
        "INSERT INTO products (id, title, price, price_old, category, img_src, stock, section, filter_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(
        id,
        title,
        price,
        body.priceOld ? Number(body.priceOld) : null,
        String(body.category || "Boutique").trim(),
        String(body.imgSrc || "/assets/images/home/demo5/product-0-1.jpg").trim(),
        stock,
        ["collection", "bestseller", "deal"].includes(body.section) ? body.section : "collection",
        String(body.filterCategory || "En vedette").trim()
      );
      send(res, 201, db.prepare(`${productSql} WHERE id = ?`).get(id));
      return;
    }

    if (productMatch && req.method === "PATCH") {
      const id = Number(productMatch[1]);
      const current = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
      if (!current) return send(res, 404, { error: "Produit introuvable" });
      const body = await readBody(req);
      const price = body.price == null ? current.price : Number(body.price);
      const stock = body.stock == null ? current.stock : Number(body.stock);
      if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
        send(res, 400, { error: "Prix ou stock invalide." });
        return;
      }
      db.prepare(
        `UPDATE products SET title = ?, price = ?, price_old = ?, category = ?, img_src = ?, stock = ?, section = ?, filter_category = ? WHERE id = ?`
      ).run(
        String(body.title || current.title).trim(),
        price,
        body.priceOld == null || body.priceOld === "" ? current.price_old : Number(body.priceOld),
        String(body.category || current.category || "").trim(),
        String(body.imgSrc || current.img_src).trim(),
        stock,
        body.section || current.section,
        String(body.filterCategory || current.filter_category || "En vedette").trim(),
        id
      );
      send(res, 200, db.prepare(`${productSql} WHERE id = ?`).get(id));
      return;
    }

    if (productMatch && req.method === "DELETE") {
      const id = Number(productMatch[1]);
      const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
      if (!result.changes) return send(res, 404, { error: "Produit introuvable" });
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
          if (item.product_id) {
            db.prepare("UPDATE products SET stock = stock + ? WHERE id = ?").run(item.quantity, item.product_id);
          }
        }
      }
      db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(body.status, row.id);
      send(res, 200, orderWithItems(db.prepare("SELECT * FROM orders WHERE id = ?").get(row.id)));
      return;
    }

    if (req.method === "GET" && orderMatch) {
      const row = db.prepare("SELECT * FROM orders WHERE number = ?").get(orderMatch[1].toUpperCase());
      if (!row) return send(res, 404, { error: "Commande introuvable" });
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
      const items = Array.isArray(body.items) ? body.items : [];
      if (!firstName || !lastName || !phone || !address || !city || !items.length) {
        send(res, 400, {
          error: "Nom, téléphone, adresse, ville et au moins un article sont requis.",
        });
        return;
      }

      const lines = [];
      for (const item of items) {
        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
          send(res, 400, { error: "Quantité invalide." });
          return;
        }
        const product = item.productId
          ? db.prepare("SELECT * FROM products WHERE id = ?").get(Number(item.productId))
          : null;
        if (product) {
          if (product.stock < quantity) {
            send(res, 400, { error: `Stock insuffisant pour ${product.title}.` });
            return;
          }
          lines.push({
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity,
          });
        } else {
          const price = Number(item.price);
          const title = String(item.title || "").trim();
          if (!title || !Number.isFinite(price) || price <= 0) {
            send(res, 400, { error: "Article invalide." });
            return;
          }
          lines.push({ productId: null, title, price, quantity });
        }
      }

      const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
      const nextId = db
        .prepare(
          "SELECT COALESCE(MAX(CAST(SUBSTR(number, 4) AS INTEGER)), 1000) + 1 AS n FROM orders"
        )
        .get().n;
      const number = `TS-${nextId}`;
      const payment = ["cod", "whatsapp", "bank"].includes(body.payment)
        ? body.payment
        : "cod";

      db.exec("BEGIN");
      try {
        const result = db
          .prepare(
            `INSERT INTO orders
              (number, customer_name, phone, email, address, city, notes, payment, total, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'nouvelle', ?)`
          )
          .run(
            number,
            `${firstName} ${lastName}`,
            phone,
            String(body.email || "").trim(),
            address,
            city,
            String(body.notes || "").trim(),
            payment,
            total,
            new Date().toISOString()
          );
        const insertItem = db.prepare(
          "INSERT INTO order_items (order_id, product_id, title, price, quantity) VALUES (?, ?, ?, ?, ?)"
        );
        const updateStock = db.prepare(
          "UPDATE products SET stock = stock - ? WHERE id = ?"
        );
        for (const line of lines) {
          insertItem.run(result.lastInsertRowid, line.productId, line.title, line.price, line.quantity);
          if (line.productId) updateStock.run(line.quantity, line.productId);
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
server.listen(port, () => {
  console.log(`TuniShop API on http://localhost:${port}`);
});
