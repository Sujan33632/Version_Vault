const versionManager = require("../services/versionManager.service");

exports.createOrUpdate = async (req, res) => {
  try {
    const commit = await versionManager.commit(
      req.params.id,
      req.body
    );
    res.status(201).json(commit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const doc = await versionManager.read({
      docId: req.params.id,
      commitId: req.query.commit,
      at: req.query.at
    });

    if (!doc) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await versionManager.history(req.params.id);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.diffDocument = async (req, res) => {
  try {
    const { from, to } = req.query;
    const docId = req.params.id;

    if (!from || !to) {
      return res.status(400).json({
        error: "Both 'from' and 'to' commit IDs are required"
      });
    }

    const diff = await versionManager.diff({
      docId,
      from,
      to
    });

    if (!diff) {
      return res.status(404).json({ error: "Commit(s) not found" });
    }

    res.json(diff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.diffDocument = async (req, res) => {
  try {
    const { from, to } = req.query;
    const docId = req.params.id;

    if (!from || !to) {
      return res.status(400).json({
        error: "Both 'from' and 'to' commit IDs are required"
      });
    }

    const diff = await versionManager.diff({
      docId,
      from,
      to
    });

    if (!diff) {
      return res.status(404).json({ error: "Commit(s) not found" });
    }

    res.json(diff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
