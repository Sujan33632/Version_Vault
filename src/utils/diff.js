exports.diffObjects = (before, after) => {
  const added = {};
  const removed = {};
  const changed = {};

  const beforeKeys = new Set(Object.keys(before));
  const afterKeys = new Set(Object.keys(after));

  for (const key of afterKeys) {
    if (!beforeKeys.has(key)) {
      added[key] = after[key];
    } else if (before[key] !== after[key]) {
      changed[key] = {
        from: before[key],
        to: after[key]
      };
    }
  }

  for (const key of beforeKeys) {
    if (!afterKeys.has(key)) {
      removed[key] = before[key];
    }
  }

  return { added, removed, changed };
};
