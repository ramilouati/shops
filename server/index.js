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
    stock INTEGER NOT NULL DEFAULT 10
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

const catalog = [
  { id: 5001, title: "Veste courte en simili cuir", price: 189, category: "Vestes", imgSrc: "/assets/images/home/demo5/product-0-1.jpg", stock: 12 },
  { id: 5002, title: "Short Calvin", price: 79, category: "Pantalons", imgSrc: "/assets/images/home/demo5/product-1-1.jpg", stock: 20 },
  { id: 5003, title: "T-shirt Kirby", price: 49, category: "T-shirts", imgSrc: "/assets/images/home/demo5/product-2-1.jpg", stock: 30 },
  { id: 5004, title: "Châle en maille torsadée", price: 119, priceOld: 159, category: "Accessoires", imgSrc: "/assets/images/home/demo5/product-3-1.jpg", stock: 8 },
  { id: 5005, title: "Chemise imprimé guépard", price: 109, priceOld: 149, category: "Chemises", imgSrc: "/assets/images/home/demo5/product-4-1.jpg", stock: 10 },
  { id: 5201, title: "Robe midi plissée", price: 139, category: "Robes", imgSrc: "/assets/images/home/demo5/product-5-1.jpg", stock: 9 },
  { id: 5202, title: "Pull col roulé en laine", price: 119, category: "Pulls", imgSrc: "/assets/images/home/demo5/product-6-1.jpg", stock: 14 },
  { id: 5203, title: "Baskets en cuir blanc", price: 199, category: "Chaussures", imgSrc: "/assets/images/home/demo5/product-7-1.jpg", stock: 7 },
  { id: 5204, title: "Sac cabas en cuir", price: 229, priceOld: 299, category: "Sacs", imgSrc: "/assets/images/home/demo5/product-8-1.jpg", stock: 6 },
  { id: 5301, title: "Veste courte en simili cuir", price: 129, category: "Offres", imgSrc: "/assets/images/home/demo5/product-10-1.jpg", stock: 5 },
  { id: 5302, title: "Short Calvin", price: 59, category: "Offres", imgSrc: "/assets/images/home/demo5/product-11-1.jpg", stock: 11 },
  { id: 5303, title: "T-shirt Kirby", price: 35, category: "Offres", imgSrc: "/assets/images/home/demo5/product-12-1.jpg", stock: 15 },
  { id: 5304, title: "Châle en maille torsadée", price: 89, category: "Offres", imgSrc: "/assets/images/home/demo5/product-13-1.jpg", stock: 8 },
];

const count = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
if (count === 0) {
  const insert = db.prepare(
    "INSERT INTO products (id, title, price, price_old, category, img_src, stock) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const product of catalog) {
    insert.run(
      product.id,
      product.title,
      product.price,
      product.priceOld ?? null,
      product.category,
      product.imgSrc,
      product.stock
    );
  }
}

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
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/products") {
      const products = db
        .prepare(
          "SELECT id, title, price, price_old AS priceOld, category, img_src AS imgSrc, stock FROM products"
        )
        .all();
      send(res, 200, products);
      return;
    }

    const productMatch = url.pathname.match(/^\/api\/products\/(\d+)$/);
    if (req.method === "GET" && productMatch) {
      const product = db
        .prepare(
          "SELECT id, title, price, price_old AS priceOld, category, img_src AS imgSrc, stock FROM products WHERE id = ?"
        )
        .get(Number(productMatch[1]));
      if (!product) return send(res, 404, { error: "Produit introuvable" });
      send(res, 200, product);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/orders") {
      const rows = db
        .prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 50")
        .all();
      send(res, 200, rows.map(orderWithItems));
      return;
    }

    const orderMatch = url.pathname.match(/^\/api\/orders\/(TS-\d+)$/);
    if (req.method === "GET" && orderMatch) {
      const row = db.prepare("SELECT * FROM orders WHERE number = ?").get(orderMatch[1]);
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
