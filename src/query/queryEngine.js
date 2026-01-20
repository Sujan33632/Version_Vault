const versionManager = require("../services/versionManager.service");

// Supported operators
const operators = {
  "$eq": (a, b) => a === b,
  "$gt": (a, b) => a > b,
  "$lt": (a, b) => a < b,
  "$gte": (a, b) => a >= b,
  "$lte": (a, b) => a <= b
};

const matchesCondition = (data, where) => {
  for (const field in where) {
    const condition = where[field];

    if (typeof condition === "object") {
      for (const op in condition) {
        if (!operators[op]) return false;
        if (!operators[op](data[field], condition[op])) {
          return false;
        }
      }
    } else {
      if (data[field] !== condition) return false;
    }
  }
  return true;
};

exports.runQuery = async ({ where = {}, at }) => {
  // Load ALL documents at a version
  // (simple MVP – scalable later)
  const documents = await versionManager.historyAll(at);

  const results = [];

  for (const doc of documents) {
    const data = JSON.parse(doc.data);
    if (matchesCondition(data, where)) {
      results.push({
        doc_id: doc.doc_id,
        version: doc.branch,
        data
      });
    }
  }

  return results;
};
