const express = require("express");
const router = express.Router();
const queryEngine = require("../query/queryEngine");

router.post("/", async (req, res) => {
  try {
    const result = await queryEngine.execute(req.body);
    res.json(result); // ← THIS must be result, not wrapped
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
