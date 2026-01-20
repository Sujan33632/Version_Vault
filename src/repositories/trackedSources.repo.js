const db = require("../config/database");

exports.add = ({ doc_id, type, config }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO tracked_sources (doc_id, type, config, created_at)
       VALUES (?, ?, ?, ?)`,
      [doc_id, type, JSON.stringify(config), new Date().toISOString()],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM tracked_sources`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};
