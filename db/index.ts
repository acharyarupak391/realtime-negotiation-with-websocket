import { verbose } from "sqlite3";

import { Database, open } from "sqlite";
const sqlite3 = verbose();

// Function to initialize SQLite database
async function initializeDatabase() {
  // open database in memory
  // const db = new sqlite3.Database(":memory:", (err) => {
  const db: Database = await open({
    filename: "./db/database.db",
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  });

  // Enable the uuid extension
  await db.run(`PRAGMA foreign_keys = ON;`);

  // Create the connections table
  await db.exec(`
      CREATE TABLE IF NOT EXISTS connections (
        connection_id TEXT PRIMARY KEY NOT NULL,
        is_party_a_online BOOLEAN NOT NULL,
        is_party_b_online BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

  // Create the messages table
  await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        connection_id TEXT NOT NULL,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        sender TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (connection_id) REFERENCES connections (connection_id)
      )
    `);

  return db;
}

export { initializeDatabase };
