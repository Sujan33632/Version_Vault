const db = require("../config/database");

/**
 * Insert immutable commit
 */
exports.insert = (commit) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO commits
       (commit_id, doc_id, parent_commit_id, timestamp, branch, data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        commit.commit_id,
        commit.doc_id,
        commit.parent_commit_id,
        commit.timestamp,
        commit.branch,
        commit.data
      ],
      (err) => (err ? reject(err) : resolve())
    );
  });
};

/**
 * Latest commit for a document
 */
exports.latest = (docId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT *
       FROM commits
       WHERE doc_id = ?
       ORDER BY timestamp DESC
       LIMIT 1`,
      [docId],
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });
};

/**
 * Commit at or before a timestamp
 */
exports.atTime = (docId, at) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT *
       FROM commits
       WHERE doc_id = ?
         AND timestamp <= ?
       ORDER BY timestamp DESC
       LIMIT 1`,
      [docId, at],
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });
};

/**
 * Fetch specific commit
 */
exports.byCommitId = (docId, commitId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT *
       FROM commits
       WHERE doc_id = ?
         AND commit_id = ?`,
      [docId, commitId],
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });
};

/**
 * Full commit history (chronological)
 */
exports.history = (docId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT *
       FROM commits
       WHERE doc_id = ?
       ORDER BY timestamp ASC`,
      [docId],
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
};

/**
 * Latest commit for every document (HEADs)
 * Uses documents table — NOT versions
 */
exports.allLatest = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT c.*
      FROM commits c
      JOIN documents d ON d.commit_id = c.commit_id
      `,
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
};