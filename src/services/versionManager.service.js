const documentsRepo = require("../repositories/documents.repo");
const commitsRepo = require("../repositories/commits.repo");
const { uuid } = require("../utils/idGenerator");
const { now } = require("../utils/time");
const { diffObjects } = require("../utils/diff");

exports.commit = async (docId, data) => {
  const exists = await documentsRepo.exists(docId);
  if (!exists) {
    await documentsRepo.create(docId);
  }

  const latest = await commitsRepo.latest(docId);

  const commit = {
    commit_id: uuid(),
    doc_id: docId,
    parent_commit_id: latest ? latest.commit_id : null,
    timestamp: now(),
    branch: "main",
    data: JSON.stringify(data)
  };

  await commitsRepo.insert(commit);
  return commit;
};

exports.read = async ({ docId, commitId, at }) => {
  // 🔥 PRIORITY 1: COMMIT ID
  if (commitId) {
    return commitsRepo.byCommitId(docId, commitId);
  }

  // 🔥 PRIORITY 2: TIMESTAMP
  if (at) {
    return commitsRepo.atTime(docId, at);
  }

  // 🔥 PRIORITY 3: LATEST
  return commitsRepo.latest(docId);
};

exports.history = async (docId) => {
  return commitsRepo.history(docId);
};

exports.diff = async ({ docId, from, to }) => {
  const fromCommit = await commitsRepo.byCommitId(docId, from);
  const toCommit = await commitsRepo.byCommitId(docId, to);

  if (!fromCommit || !toCommit) {
    return null;
  }

  const fromData = JSON.parse(fromCommit.data);
  const toData = JSON.parse(toCommit.data);

  return diffObjects(fromData, toData);
};
