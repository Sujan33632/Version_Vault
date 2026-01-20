const express = require("express");
const controller = require("../controllers/tracking.controller");

const router = express.Router();

router.post("/link", controller.link);        // git add
router.post("/snapshot", controller.snapshot); // git commit

module.exports = router;
