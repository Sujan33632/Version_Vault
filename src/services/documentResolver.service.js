const documentsRepo = require("../repositories/documents.repo");

/**
 * Resolve a document snapshot at a given version.
 * NO SQL LOGIC HERE.
 */
exports.resolve = async (doc_id, version = null) => {
  // If version not specified → latest
  if (!version) {
    const doc = await documentsRepo.getLatestByDocId(doc_id);
    return {
      ...doc,
      data: typeof doc?.data === "string"
        ? JSON.parse(doc.data)
        : doc?.data
    };
  }

  // Resolve exact version (branch-safe)
  const doc = await documentsRepo.getByVersion(doc_id, version);
  return {
    ...doc,
    data: typeof doc?.data === "string"
      ? JSON.parse(doc.data)
      : doc?.data
  };
};

/**
 * Get all versions for a document (sorted descending)
 */
exports.getAllVersions = async (doc_id) => {
  const all = await documentsRepo.getAllByDocId(doc_id);
  if (!all || all.length === 0) return [];
  
  return [...all].sort((a, b) => 
    compareVersions(a.branch, b.branch)
  );
};
