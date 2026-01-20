const versionManager = require("../services/versionManager.service");

exports.createOrUpdate = async (req, res) => {
  try {
    const result = await versionManager.commit(
      req.params.id,
      req.body,
      (req.query && req.query.baseVersion) || null
    );
    res.status(201).json(result);
  } catch (err) {
    console.error(err);

    if (res && typeof res.status === "function") {
      return res.status(400).json({ error: err.message });
    }

    throw err;
  }
};

exports.getDocument = async (req, res) => {
  const doc = await versionManager.read({
    docId: req.params.id,
    version: req.query.version,
    commitId: req.query.commit,
    at: req.query.at
  });

  doc
    ? res.json(doc)
    : res.status(404).json({ error: "Not found" });
};

exports.getHistory = async (req, res) => {
  res.json(await versionManager.history(req.params.id));
};

exports.diffDocument = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      error: "Both 'from' and 'to' are required"
    });
  }

  const diff = await versionManager.diff({
    docId: req.params.id,
    from,
    to
  });

  diff
    ? res.json(diff)
    : res.status(404).json({ error: "Invalid versions or commits" });
};

exports.deleteVersion = async (req, res) => {
  try {
    const result = await versionManager.deleteVersion(
      req.params.id,
      req.params.version
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
