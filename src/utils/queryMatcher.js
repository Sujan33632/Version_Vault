exports.matchesWhere = (row, where = {}) => {
  if (!where) return true;

  for (const field in where) {
    const condition = where[field];
    const value = row[field];

    if (typeof condition === "object") {
      if ("$gt" in condition && !(value > condition.$gt)) return false;
      if ("$lt" in condition && !(value < condition.$lt)) return false;
      if ("$eq" in condition && !(value === condition.$eq)) return false;
    } else {
      if (value !== condition) return false;
    }
  }

  return true;
};
