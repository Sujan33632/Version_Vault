const express = require("express");
const controller = require("../controllers/documents.controller");

const router = express.Router();

// Write
router.post("/:id", controller.createOrUpdate);

// Reads (specific first)
router.get("/:id/history", controller.getHistory);
router.get("/:id/diff", controller.diffDocument);
router.get("/:id", controller.getDocument);

module.exports = router;
