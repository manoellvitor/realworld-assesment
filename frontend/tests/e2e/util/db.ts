import Database from 'better-sqlite3';
import { UserCredentials } from '../support/types';
import crypto from 'crypto';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../../backend/db.sqlite3');
const db = new Database(dbPath, {
  verbose: console.log,
});

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(22).toString('base64').slice(0, 22);
  const iterations = 720000;

  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, 32, 'sha256')
    .toString('base64');

  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

export async function createUser(userData: UserCredentials): Promise<void> {
  const isUserExists = db
    .prepare('SELECT * FROM users_user WHERE email = ?')
    .get(userData.email);
  if (!isUserExists) {
    const hashedPassword = hashPassword(userData.password);
    const query = `INSERT INTO users_user (
      username, 
      email, 
      password, 
      is_superuser, 
      is_staff, 
      is_active, 
      date_joined, 
      bio,
      image,
      last_login
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
      const now = new Date().toISOString().replace('T', ' ').replace('Z', '');
      db.prepare(query).run(
        userData.username,
        userData.email,
        hashedPassword,
        0,
        0,
        1,
        now,
        '',
        null,
        null
      );
    } catch (error) {
      throw new Error(`Error executing SQL query: ${query}. Error: ${error}`);
    }
  }
  console.log('User created successfully!');
}

interface TableInfo {
  name: string;
}

export async function cleanDatabase(): Promise<void> {
  try {
    // Get all table names
    const tables = db
      .prepare(
        `
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%'
    `
      )
      .all() as TableInfo[];

    // Disable foreign keys temporarily
    db.prepare('PRAGMA foreign_keys = OFF').run();

    // Delete all data from each table
    for (const table of tables) {
      db.prepare(`DELETE FROM ${table.name}`).run();
    }

    // Reset autoincrement counters
    for (const table of tables) {
      db.prepare(`DELETE FROM sqlite_sequence WHERE name = ?`).run(table.name);
    }

    // Re-enable foreign keys
    db.prepare('PRAGMA foreign_keys = ON').run();

    console.log('Database cleaned successfully!');
  } catch (error) {
    throw new Error(`Error cleaning database: ${error}`);
  }
}

export default db;
