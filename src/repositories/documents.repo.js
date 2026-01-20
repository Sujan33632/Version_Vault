const db = require("../config/database");
const { now } = require("../utils/time");

exports.exists = (docId) => {
  return new Promise((resolve) => {
    db.get(
      "SELECT 1 FROM documents WHERE doc_id = ?",
      [docId],
      (err, row) => resolve(!!row)
    );
  });
};

exports.create = (docId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO documents (doc_id, created_at) VALUES (?, ?)",
      [docId, now()],
      (err) => (err ? reject(err) : resolve())
    );
  });
};
