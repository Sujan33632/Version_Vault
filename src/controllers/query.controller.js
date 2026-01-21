const queryService = require("../services/query.service");

exports.run = async (req, res) => {
  try {
    const result = await queryService.run(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
