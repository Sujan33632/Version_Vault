const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Always resolve DB relative to project root
const dbPath = path.resolve(__dirname, "../../data/timetravel.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite DB", err);
  } else {
    console.log("Connected to SQLite DB");
  }
});

module.exports = db;
