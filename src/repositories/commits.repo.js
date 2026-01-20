const db = require("../config/database");

exports.insert = (commit) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO commits VALUES (?, ?, ?, ?, ?, ?)`,
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

exports.latest = (docId) => {
  return new Promise((resolve) => {
    db.get(
      `SELECT * FROM commits
       WHERE doc_id = ?
       ORDER BY timestamp DESC
       LIMIT 1`,
      [docId],
      (_, row) => resolve(row)
    );
  });
};

exports.atTime = (docId, at) => {
  return new Promise((resolve) => {
    db.get(
      `SELECT * FROM commits
       WHERE doc_id = ?
         AND timestamp <= ?
       ORDER BY timestamp DESC
       LIMIT 1`,
      [docId, at],
      (_, row) => resolve(row)
    );
  });
};

exports.byCommitId = (docId, commitId) => {
  return new Promise((resolve) => {
    db.get(
      `SELECT * FROM commits
       WHERE doc_id = ?
         AND commit_id = ?`,
      [docId, commitId],
      (_, row) => resolve(row)
    );
  });
};

exports.history = (docId) => {
  return new Promise((resolve) => {
    db.all(
      `SELECT * FROM commits
       WHERE doc_id = ?
       ORDER BY timestamp ASC`,
      [docId],
      (_, rows) => resolve(rows)
    );
  });
};
