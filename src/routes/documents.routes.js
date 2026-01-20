const express = require("express");
const c = require("../controllers/documents.controller");
const r = express.Router();

r.post("/:id", c.createOrUpdate);
r.get("/:id/history", c.getHistory);
r.get("/:id/diff", c.diffDocument);

// 🔥 NEW DELETE ROUTE
r.delete("/:id/version/:version", c.deleteVersion);

r.get("/:id", c.getDocument);

module.exports = r;
