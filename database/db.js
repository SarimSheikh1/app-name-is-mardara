const { DatabaseSync } = require('node:sqlite');
const fs = require('fs'); const path = require('path');
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'mardara.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new DatabaseSync(dbPath); db.exec('PRAGMA foreign_keys = ON');
db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, bio TEXT DEFAULT '', status TEXT DEFAULT 'Available', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS meetings (id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, host_id INTEGER NOT NULL, title TEXT NOT NULL, password_hash TEXT, starts_at TEXT, duration INTEGER DEFAULT 60, locked INTEGER DEFAULT 0, waiting_room INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(host_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS calls (id INTEGER PRIMARY KEY, caller_id INTEGER NOT NULL, receiver_id INTEGER NOT NULL, type TEXT NOT NULL CHECK(type IN ('voice','video')), status TEXT NOT NULL, started_at TEXT DEFAULT CURRENT_TIMESTAMP, ended_at TEXT, duration INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, meeting_id INTEGER NOT NULL, sender_id INTEGER NOT NULL, body TEXT, file_name TEXT, file_path TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, body TEXT NOT NULL, read INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
db.exec('CREATE TABLE IF NOT EXISTS password_resets (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, code_hash TEXT NOT NULL, expires_at TEXT NOT NULL, used INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id))');
// Lightweight migration for databases created before admin roles existed.
const userColumns = db.prepare('PRAGMA table_info(users)').all().map(column => column.name);
if (!userColumns.includes('is_admin')) db.exec('ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0');
if (!userColumns.includes('avatar_url')) db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT ''");
if (!userColumns.includes('theme_color')) db.exec("ALTER TABLE users ADD COLUMN theme_color TEXT DEFAULT '#e42b3f'");
if (!userColumns.includes('app_name')) db.exec("ALTER TABLE users ADD COLUMN app_name TEXT DEFAULT 'Mardara Uchiha'");
if (!userColumns.includes('app_identity_locked')) db.exec('ALTER TABLE users ADD COLUMN app_identity_locked INTEGER NOT NULL DEFAULT 0');
module.exports = db;
