import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const TEAM_ROLES = ["admin", "staff"];
export const COOKIE_TEAM = "tunishop_team";
export const COOKIE_CUSTOMER = "tunishop_customer";

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(String(password), salt, 64);
  const prev = Buffer.from(hash, "hex");
  return prev.length === next.length && timingSafeEqual(prev, next);
}

export function newToken() {
  return randomBytes(32).toString("hex");
}

export function readCookie(req, name) {
  const match = String(req.headers.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

export function cookieOptions(req, maxAge = 43200) {
  const secure = req.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
  return `HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone || "",
    role: row.role,
    active: !!row.active,
    createdAt: row.created_at,
  };
}

export function ensureAuthTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      kind TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS wishlists (
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, product_id)
    );
  `);

  const count = db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
  if (count === 0) {
    const insert = db.prepare(
      "INSERT INTO users (email, password_hash, name, phone, role, active, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)"
    );
    const now = new Date().toISOString();
    insert.run("admin@tunishop.tn", hashPassword("admin123"), "Admin TuniShop", "21670000000", "admin", now);
    insert.run("staff@tunishop.tn", hashPassword("staff123"), "Équipe boutique", "21670000001", "staff", now);
    insert.run("client@tunishop.tn", hashPassword("client123"), "Client démo", "21620000000", "customer", now);
  }
}

export function createSession(db, userId, kind, hours = 12) {
  const token = newToken();
  const expires = new Date(Date.now() + hours * 3600_000).toISOString();
  db.prepare("INSERT INTO sessions (token, user_id, kind, expires_at) VALUES (?, ?, ?, ?)").run(
    token,
    userId,
    kind,
    expires
  );
  return { token, expires };
}

export function destroySession(db, token) {
  if (!token) return;
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function userFromSession(db, token, kind) {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.kind = ? AND s.expires_at > ? AND u.active = 1`
    )
    .get(token, kind, new Date().toISOString());
  return row || null;
}
