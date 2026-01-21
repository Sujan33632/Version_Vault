const documentsRepo = require("../repositories/documents.repo");
const { matchesWhere } = require("../utils/queryMatcher");

exports.run = async ({ from, at, where }) => {
  let doc;

  if (at) {
    doc = await documentsRepo.getByVersion(from, at);
  } else {
    doc = await documentsRepo.getLatestByDocId(from);
  }

  if (!doc) return [];

  const parsed = JSON.parse(doc.data || "{}");
  const rows = parsed.rows || [];

  return rows.filter(row => matchesWhere(row, where));
};
