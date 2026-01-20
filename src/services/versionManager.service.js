const documentsRepo = require("../repositories/documents.repo");
const commitsRepo = require("../repositories/commits.repo");
const versionsRepo = require("../repositories/versions.repo");
const { uuid } = require("../utils/idGenerator");
const { now } = require("../utils/time");
const { diffObjects } = require("../utils/diff");

// ---------- helpers ----------

const parseMajor = (v) => parseInt(v.slice(1), 10);

const getLatestVersion = (versions) => {
  const majors = versions
    .map(v => v.version_name)
    .filter(v => !v.includes("."))
    .map(parseMajor);

  return majors.length ? "v" + Math.max(...majors) : null;
};

const nextMajor = (latest) =>
  "v" + (parseMajor(latest) + 1);

const nextBranch = (base, versions) => {
  const prefix = base + ".";
  const subs = versions
    .map(v => v.version_name)
    .filter(v => v.startsWith(prefix))
    .map(v => parseInt(v.slice(prefix.length), 10))
    .filter(n => !isNaN(n));

  return base + "." + ((subs.length ? Math.max(...subs) : 0) + 1);
};

// ---------- core ----------

exports.commit = async (docId, data, baseVersion = null) => {
  if (!(await documentsRepo.exists(docId))) {
    await documentsRepo.create(docId);
  }

  const versions = await versionsRepo.getAll(docId);
  const latest = getLatestVersion(versions);

  // 1️⃣ Resolve base version FIRST
  let baseVersionName = baseVersion || latest;
  let baseCommitId = null;

  if (baseVersionName) {
    const baseRow = await versionsRepo.get(docId, baseVersionName);
    if (!baseRow) {
      throw new Error(`Base version ${baseVersionName} does not exist`);
    }
    baseCommitId = baseRow.commit_id;

    // 2️⃣ NO-OP CHECK (CRITICAL FIX)
    const baseCommit = await commitsRepo.byCommitId(docId, baseCommitId);
    const baseData = JSON.parse(baseCommit.data);
    const diff = diffObjects(baseData, data);

    const isNoOp =
      Object.keys(diff.added).length === 0 &&
      Object.keys(diff.removed).length === 0 &&
      Object.keys(diff.changed).length === 0;

    if (isNoOp) {
      return {
        version: baseVersionName,
        message: "No changes detected. Version unchanged."
      };
    }
  }

  // 3️⃣ Decide new version ONLY AFTER no-op check
  let newVersion;
  if (!latest) {
    newVersion = "v1";
  } else if (!baseVersion || baseVersion === latest) {
    newVersion = nextMajor(latest);
  } else {
    newVersion = nextBranch(baseVersion, versions);
  }

  // 4️⃣ Create commit
  const commit = {
    commit_id: uuid(),
    doc_id: docId,
    parent_commit_id: baseCommitId,
    timestamp: now(),
    branch: newVersion,
    data: JSON.stringify(data)
  };

  await commitsRepo.insert(commit);
  await versionsRepo.insert(docId, newVersion, commit.commit_id);

  return { version: newVersion, ...commit };
};

// ---------- reads ----------

exports.read = async ({ docId, version, commitId, at }) => {
  if (version) {
    const row = await versionsRepo.get(docId, version);
    return row ? commitsRepo.byCommitId(docId, row.commit_id) : null;
  }

  if (commitId) return commitsRepo.byCommitId(docId, commitId);
  if (at) return commitsRepo.atTime(docId, at);

  const versions = await versionsRepo.getAll(docId);
  const latest = getLatestVersion(versions);
  if (!latest) return null;

  const row = await versionsRepo.get(docId, latest);
  return commitsRepo.byCommitId(docId, row.commit_id);
};

exports.history = async (docId) => commitsRepo.history(docId);

// ---------- diff ----------

exports.diff = async ({ docId, from, to }) => {
  const normalize = (v) => (typeof v === "string" ? v.trim() : v);

  const resolve = async (v) => {
    v = normalize(v);
    if (v.startsWith("v")) {
      const row = await versionsRepo.get(docId, v);
      return row ? row.commit_id : null;
    }
    return v;
  };

  const fromId = await resolve(from);
  const toId = await resolve(to);

  if (!fromId || !toId) return null;

  const a = await commitsRepo.byCommitId(docId, fromId);
  const b = await commitsRepo.byCommitId(docId, toId);

  if (!a || !b) return null;

  return diffObjects(JSON.parse(a.data), JSON.parse(b.data));
};

exports.deleteVersion = async (docId, version) => {
  const versions = await versionsRepo.getAll(docId);

  const versionRow = versions.find(v => v.version_name === version);
  if (!versionRow) {
    throw new Error(`Version ${version} does not exist`);
  }

  // Determine latest version
  const latest = versions
    .map(v => v.version_name)
    .filter(v => !v.includes("."))
    .sort((a, b) => parseInt(b.slice(1)) - parseInt(a.slice(1)))[0];

  if (version === latest) {
    throw new Error("Cannot delete the latest version");
  }

  // Check for child versions
  const hasChildren = versions.some(v =>
    v.version_name.startsWith(version + ".")
  );

  if (hasChildren) {
    throw new Error("Cannot delete version with child branches");
  }

  await versionsRepo.delete(docId, version);

  return {
    version,
    message: "Version deleted successfully"
  };
};

exports.historyAll = async (atVersion) => {
  const commits = await commitsRepo.allLatest();

  if (!atVersion) return commits;

  const filtered = [];
  const seen = new Set();

  for (const commit of commits) {
    if (seen.has(commit.doc_id)) continue;
    seen.add(commit.doc_id);

    const resolved = await exports.read({
      docId: commit.doc_id,
      version: atVersion
    });
    if (resolved) filtered.push(resolved);
  }

  return filtered;
};
