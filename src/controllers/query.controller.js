const queryEngine = require("../query/queryEngine");

exports.runQuery = async (req, res) => {
  try {
    const result = await queryEngine.runQuery(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
