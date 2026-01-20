require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../config/database");

const migrationPath = path.join(__dirname, "001_init.sql");
const sql = fs.readFileSync(migrationPath, "utf8");

db.exec(sql, (err) => {
  if (err) {
    console.error("Migration failed:", err);
  } else {
    console.log("Database initialized successfully");
  }
});
