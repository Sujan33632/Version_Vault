const snapshotService = require("../services/snapshot.service");

exports.linkDatabase = async (req, res) => {
  try {
    const { type, doc_id, config } = req.body;
    let snapshot;

    if (type === "postgres") {
      const postgres = require("../db-links/postgres.adapter");
      snapshot = await postgres.snapshotPostgres(config);
    } else {
      return res.status(400).json({ error: "Unsupported DB type" });
    }

    const result = await snapshotService.commitSnapshot({
      doc_id,
      data: snapshot
    });

    return res.json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
