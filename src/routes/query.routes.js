const express = require("express");
const controller = require("../controllers/query.controller");

const router = express.Router();

// Conditional SELECT queries
router.post("/", controller.runQuery);

module.exports = router;
