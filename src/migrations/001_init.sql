CREATE TABLE IF NOT EXISTS documents (
  doc_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commits (
  commit_id TEXT PRIMARY KEY,
  doc_id TEXT NOT NULL,
  parent_commit_id TEXT,
  timestamp TEXT NOT NULL,
  branch TEXT NOT NULL,
  data TEXT NOT NULL
);
