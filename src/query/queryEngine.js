const versionManager = require("../services/versionManager.service");

function normalize(data) {
  let d = data;
  while (typeof d === "string") {
    d = JSON.parse(d);
  }
  return d;
}

function matchWhere(row, where) {
  for (const key in where) {
    const cond = where[key];

    if (typeof cond === "object") {
      if ("$gt" in cond && !(row[key] > cond.$gt)) return false;
      if ("$lt" in cond && !(row[key] < cond.$lt)) return false;
      if ("$eq" in cond && row[key] !== cond.$eq) return false;
    } else {
      if (row[key] !== cond) return false;
    }
  }
  return true;
}

exports.execute = async ({ from, at, where }) => {
  const doc = await versionManager.read({
    docId: from,
    version: at
  });

  if (!doc) return [];

  const payload = normalize(doc.data);

  // 🔒 IMPORTANT: only snapshot documents are queryable
  if (!payload || !Array.isArray(payload.rows)) {
    return [];
  }

  if (!where || Object.keys(where).length === 0) {
    return payload.rows;
  }

  return payload.rows.filter(row => matchWhere(row, where));
};
