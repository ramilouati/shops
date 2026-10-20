/**
 * Import a sample of the Kaggle Fashion Product Images dataset
 * (styles.csv + images/) into the local TuniShop SQLite catalog.
 *
 * Usage:
 *   node --experimental-sqlite scripts/import-kaggle.js
 * Optional env:
 *   KAGGLE_CSV=/path/to/styles.csv
 *   KAGGLE_IMAGES=/path/to/images
 *   KAGGLE_LIMIT=80
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dbFile = process.env.SQLITE_PATH || path.join(root, "server", "data", "tunishop.db");
const csvPath =
  process.env.KAGGLE_CSV ||
  path.join(process.env.HOME || "", "Downloads", "styles.csv");
const imagesDir =
  process.env.KAGGLE_IMAGES ||
  path.join(process.env.HOME || "", "Downloads", "archive (1)", "images");
const uploadsDir = path.join(root, "public", "uploads");
const limit = Number(process.env.KAGGLE_LIMIT || 80);

const typeMap = {
  Shirts: "Chemises",
  Tshirts: "T-shirts",
  Jeans: "Pantalons",
  Trousers: "Pantalons",
  Shorts: "Pantalons",
  "Track Pants": "Pantalons",
  Jackets: "Vestes",
  Sweaters: "Pulls",
  Sweatshirts: "Pulls",
  Dresses: "Robes",
  Kurtas: "Robes",
  Tops: "Robes",
  "Casual Shoes": "Chaussures",
  "Sports Shoes": "Chaussures",
  Heels: "Chaussures",
  Sandals: "Chaussures",
  Handbags: "Sacs",
  Watches: "Accessoires",
  Belts: "Accessoires",
  Wallets: "Accessoires",
  Sunglasses: "Accessoires",
};

const perType = Math.max(3, Math.ceil(limit / Object.keys(typeMap).length));

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    if (row.some((value) => value.trim())) rows.push(row);
  }
  return rows;
};

if (!fs.existsSync(csvPath)) {
  console.error("CSV introuvable:", csvPath);
  process.exit(1);
}
if (!fs.existsSync(imagesDir)) {
  console.error("Dossier images introuvable:", imagesDir);
  process.exit(1);
}

fs.mkdirSync(path.dirname(dbFile), { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

const table = parseCsv(fs.readFileSync(csvPath, "utf8"));
const header = table[0].map((name) => name.trim());
const index = Object.fromEntries(header.map((name, i) => [name, i]));
const buckets = Object.fromEntries(Object.keys(typeMap).map((key) => [key, []]));

for (const cells of table.slice(1)) {
  const articleType = cells[index.articleType];
  if (!buckets[articleType] || buckets[articleType].length >= perType) continue;
  const id = cells[index.id];
  const imagePath = path.join(imagesDir, `${id}.jpg`);
  if (!fs.existsSync(imagePath)) continue;
  buckets[articleType].push({
    kaggleId: id,
    title: String(cells[index.productDisplayName] || "").trim(),
    articleType,
    category: typeMap[articleType],
  });
}

const picked = Object.values(buckets).flat().slice(0, limit);
if (!picked.length) {
  console.error("Aucun produit avec image trouvé.");
  process.exit(1);
}

const priceFor = (id) => {
  const n = Number(id) || 1;
  return 39 + (n % 26) * 10;
};

const stockFor = (id) => 5 + (Number(id) % 20);
const sections = ["collection", "bestseller", "deal"];
const filters = ["En vedette", "Populaires", "Mieux notés"];

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

db.exec("BEGIN");
try {
  db.prepare("DELETE FROM product_images").run();
  db.prepare("DELETE FROM stock_moves").run();
  db.prepare("DELETE FROM products").run();
  db.prepare("DELETE FROM categories").run();

  const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
  const insertProduct = db.prepare(
    "INSERT INTO products (id, title, price, price_old, category, img_src, stock, section, filter_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertImage = db.prepare(
    "INSERT INTO product_images (product_id, src, position) VALUES (?, ?, 0)"
  );
  const insertMove = db.prepare(
    "INSERT INTO stock_moves (product_id, delta, stock_after, reason, note, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  );

  for (const name of [...new Set(picked.map((item) => item.category))]) {
    insertCategory.run(name);
  }

  let nextId = 6001;
  for (const [indexItem, item] of picked.entries()) {
    const id = nextId++;
    const price = priceFor(item.kaggleId);
    const stock = stockFor(item.kaggleId);
    const section = sections[indexItem % sections.length];
    const filterCategory = filters[indexItem % filters.length];
    const filename = `kaggle-${item.kaggleId}.jpg`;
    const dest = path.join(uploadsDir, filename);
    fs.copyFileSync(path.join(imagesDir, `${item.kaggleId}.jpg`), dest);
    const src = `/uploads/${filename}`;
    const title = item.title || `${item.articleType} ${item.kaggleId}`;
    insertProduct.run(id, title, price, null, item.category, src, stock, section, filterCategory);
    insertImage.run(id, src);
    insertMove.run(id, stock, stock, "inventaire", "Import Kaggle", new Date().toISOString());
  }
  db.exec("COMMIT");
  console.log(`Import OK : ${picked.length} articles, images dans public/uploads/`);
  console.log(`Catégories : ${[...new Set(picked.map((item) => item.category))].join(", ")}`);
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}
