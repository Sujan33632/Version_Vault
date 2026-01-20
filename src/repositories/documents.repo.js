const db = require("../config/database");

exports.exists = (docId) => {
  return new Promise((resolve) => {
    db.get(
      `SELECT doc_id FROM documents WHERE doc_id = ?`,
      [docId],
      (_, row) => resolve(!!row)
    );
  });
};

exports.create = (docId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO documents (doc_id) VALUES (?)`,
      [docId],
      (err) => (err ? reject(err) : resolve())
    );
  });
};
