const db = require("../config/database");

/**
 * Create document HEAD
 */
exports.create = (docId, commitId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO documents (doc_id, commit_id)
       VALUES (?, ?)`,
      [docId, commitId],
      (err) => (err ? reject(err) : resolve())
    );
  });
};

/**
 * Update document HEAD
 */
exports.update = (docId, commitId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE documents
       SET commit_id = ?
       WHERE doc_id = ?`,
      [commitId, docId],
      (err) => (err ? reject(err) : resolve())
    );
  });
};

/**
 * Check if document exists
 */
exports.exists = (docId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 1 FROM documents WHERE doc_id = ?`,
      [docId],
      (err, row) => (err ? reject(err) : resolve(!!row))
    );
  });
};

/**
 * Get HEAD commit for document
 */
exports.getHead = (docId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT commit_id FROM documents WHERE doc_id = ?`,
      [docId],
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });
};
