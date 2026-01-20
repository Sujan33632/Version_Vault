const express = require("express");
const controller = require("../controllers/documents.controller");

const router = express.Router();

router.post("/:id", controller.createOrUpdate);
router.get("/:id/history", controller.getHistory);
router.get("/:id", controller.getDocument);

module.exports = router;
