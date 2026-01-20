const trackedRepo = require("../repositories/trackedSources.repo");
const commitsRepo = require("../repositories/commits.repo");
const versionManager = require("../services/versionManager.service");

exports.link = async (req, res) => {
  const { doc_id, type, config } = req.body;
  await trackedRepo.add({ doc_id, type, config });

  res.json({
    message: "Database linked successfully. Tracking started.",
    doc_id
  });
};

exports.snapshot = async (req, res) => {
  try {
    const sources = (await trackedRepo.getAll()) || [];
    const seen = new Set();
    const results = [];
    const skipped = [];

    for (const source of sources) {
      if (seen.has(source.doc_id)) continue;
      seen.add(source.doc_id);

      if (source.type !== "postgres") continue;

      const postgres = require("../db-links/postgres.adapter");
      const raw = await postgres.snapshotPostgres(JSON.parse(source.config));

      // Normalize: sort rows deterministically
      const normalized = [...raw.rows].sort((a, b) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b))
      );

      const cleaned = {
        rows: normalized
      };

      // Step 1: Fetch latest version FIRST
      const latest = await commitsRepo.latest(source.doc_id);

      // Step 2: Compare BEFORE committing
      let shouldCommit = true;

      if (latest) {
        const prev = JSON.parse(latest.data);
        const prevRows = JSON.stringify(prev.rows);
        const currRows = JSON.stringify(cleaned.rows);

        if (prevRows === currRows) {
          shouldCommit = false;
        }
      }

      // Step 3: Only commit if changed
      if (!shouldCommit) {
        skipped.push(source.doc_id);
        continue;
      }

      const result = await versionManager.commit(
        source.doc_id,
        cleaned,
        null
      );

      if (result && !result.message) {
        results.push({ doc_id: source.doc_id, result });
      }
    }

    // Step 4: Response
    if (results.length === 0 && skipped.length === sources.length) {
      return res.json({ message: "No changes detected" });
    }

    res.json({
      message: "Snapshot completed",
      results,
      skipped: skipped.length > 0 ? skipped : undefined
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
