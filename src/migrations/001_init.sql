CREATE TABLE IF NOT EXISTS documents (
  doc_id TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS commits (
  commit_id TEXT PRIMARY KEY,
  doc_id TEXT NOT NULL,
  parent_commit_id TEXT,
  timestamp TEXT NOT NULL,
  branch TEXT NOT NULL,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS versions (
  doc_id TEXT NOT NULL,
  version_name TEXT NOT NULL,
  commit_id TEXT NOT NULL,
  PRIMARY KEY (doc_id, version_name)
);
