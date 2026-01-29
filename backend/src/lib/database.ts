import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { hashPassword } from './auth';

const dbPath = path.join(__dirname, '../../devpulse.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);

// Create tables
async function initializeDatabase() {
  // Users table with password
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      username TEXT UNIQUE,
      password_hash TEXT,
      daily_goal INTEGER DEFAULT 120,
      weekly_goal INTEGER DEFAULT 600,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      end_time DATETIME,
      duration INTEGER,
      project TEXT DEFAULT 'Untitled Project',
      tags TEXT DEFAULT '[]',
      notes TEXT,
      is_active BOOLEAN DEFAULT true,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Dev logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS dev_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      content TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      mood INTEGER DEFAULT 3,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Daily stats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_stats (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      date DATE DEFAULT CURRENT_DATE,
      total_sessions INTEGER DEFAULT 0,
      total_focus_time INTEGER DEFAULT 0,
      projects TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // User settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      theme TEXT DEFAULT 'dark',
      notifications BOOLEAN DEFAULT true,
      default_project TEXT,
      default_tags TEXT DEFAULT '[]',
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Insert default user if not exists
  const defaultUser = db.prepare('SELECT id FROM users WHERE email = ?').get('dev@example.com');
  if (!defaultUser) {
    const userId = 'test-user-' + Date.now();
    const passwordHash = await hashPassword('password123');
    
    db.prepare(`
      INSERT INTO users (id, email, username, password_hash, daily_goal, weekly_goal)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, 'dev@example.com', 'developer', passwordHash, 120, 600);
    
    // Create default settings
    db.prepare(`
      INSERT INTO user_settings (id, user_id, theme, notifications, default_project, default_tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'settings-' + userId,
      userId,
      'dark',
      true,
      'DevPulse Development',
      JSON.stringify(['coding', 'portfolio'])
    );
    
    console.log('Created default user: developer (password: password123)');
  }

  console.log('Database initialized successfully');
}

// Initialize on import
initializeDatabase().catch(console.error);

export default db;
