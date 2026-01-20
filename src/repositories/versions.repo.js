const db = require("../config/database");

exports.getAll = (docId) => {
  return new Promise((resolve) => {
    db.all(
      `SELECT * FROM versions WHERE doc_id = ?`,
      [docId],
      (_, rows) => resolve(rows)
    );
  });
};

exports.get = (docId, version) => {
  return new Promise((resolve) => {
    db.get(
      `SELECT * FROM versions WHERE doc_id = ? AND version_name = ?`,
      [docId, version],
      (_, row) => resolve(row)
    );
  });
};

exports.insert = (docId, version, commitId) => {
  return new Promise((resolve) => {
    db.run(
      `INSERT INTO versions VALUES (?, ?, ?)`,
      [docId, version, commitId],
      () => resolve()
    );
  });
};

exports.update = (docId, version, commitId) => {
  return new Promise((resolve) => {
    db.run(
      `UPDATE versions SET commit_id = ? WHERE doc_id = ? AND version_name = ?`,
      [commitId, docId, version],
      () => resolve()
    );
  });
};

// 🔥 NEW — delete version pointer
exports.delete = (docId, version) => {
  return new Promise((resolve) => {
    db.run(
      `DELETE FROM versions WHERE doc_id = ? AND version_name = ?`,
      [docId, version],
      () => resolve()
    );
  });
};
