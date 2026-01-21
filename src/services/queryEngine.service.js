const documentResolver = require("./documentResolver.service");

function matches(row, where) {
  return Object.entries(where || {}).every(([key, condition]) => {
    if (typeof condition === "object" && condition !== null) {
      if ("$gt" in condition) return row[key] > condition.$gt;
      if ("$lt" in condition) return row[key] < condition.$lt;
      if ("$eq" in condition) return row[key] === condition.$eq;
      if ("$gte" in condition) return row[key] >= condition.$gte;
      if ("$lte" in condition) return row[key] <= condition.$lte;
      if ("$ne" in condition) return row[key] !== condition.$ne;
      return false;
    }
    return row[key] === condition;
  });
}

exports.run = async ({ from, at, where }) => {
  const doc = at
    ? await documentResolver.resolveAtVersion(from, at)
    : await documentResolver.resolveLatest(from);

  if (!doc) return [];

  const parsed = JSON.parse(doc.data);
  const rows = parsed.rows || [];

  return rows.filter(row => matches(row, where));
};
