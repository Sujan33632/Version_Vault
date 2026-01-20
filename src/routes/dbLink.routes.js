const express = require("express");
const controller = require("../controllers/dbLink.controller");

const router = express.Router();

router.post("/", controller.linkDatabase);

module.exports = router;
