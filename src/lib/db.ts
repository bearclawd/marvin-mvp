import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DATABASE_URL || path.join(process.cwd(), "marvin.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS shops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      website TEXT DEFAULT '',
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      specializations TEXT DEFAULT '',
      materials TEXT DEFAULT '',
      certifications TEXT DEFAULT '',
      erp_system TEXT DEFAULT '',
      weekly_rfqs INTEGER DEFAULT 0,
      turnaround_days INTEGER DEFAULT 5,
      pain_points TEXT DEFAULT '',
      outsourced_processes TEXT DEFAULT '',
      suppliers_info TEXT DEFAULT '',
      onboarding_complete INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER REFERENCES shops(id),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER REFERENCES shops(id),
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      avg_margin REAL DEFAULT 0,
      total_orders INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rfqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER REFERENCES shops(id),
      customer_id INTEGER REFERENCES customers(id),
      title TEXT NOT NULL,
      status TEXT DEFAULT 'incoming',
      total_value REAL DEFAULT 0,
      margin_pct REAL DEFAULT 0,
      due_date TEXT,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rfq_parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rfq_id INTEGER REFERENCES rfqs(id),
      name TEXT NOT NULL,
      material TEXT DEFAULT '',
      quantity INTEGER DEFAULT 1,
      tolerance TEXT DEFAULT '',
      surface_finish TEXT DEFAULT '',
      machining_time_min REAL DEFAULT 0,
      material_cost REAL DEFAULT 0,
      unit_price REAL DEFAULT 0,
      notes TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER REFERENCES shops(id),
      name TEXT NOT NULL,
      category TEXT DEFAULT '',
      materials TEXT DEFAULT '',
      lead_time_days INTEGER DEFAULT 5,
      rating REAL DEFAULT 4.0,
      contact_email TEXT DEFAULT '',
      contact_phone TEXT DEFAULT '',
      location TEXT DEFAULT '',
      notes TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER REFERENCES shops(id),
      direction TEXT DEFAULT 'inbound',
      channel TEXT DEFAULT 'email',
      from_name TEXT DEFAULT '',
      subject TEXT DEFAULT '',
      body TEXT DEFAULT '',
      category TEXT DEFAULT 'general',
      is_read INTEGER DEFAULT 0,
      rfq_id INTEGER REFERENCES rfqs(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER REFERENCES shops(id),
      type TEXT DEFAULT 'info',
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      icon TEXT DEFAULT 'activity',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export default getDb;
