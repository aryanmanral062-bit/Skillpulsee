-- USERS: unified identity across GitHub + Jira
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  github_login  TEXT,
  jira_account_id TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RAW GITHUB COMMITS
CREATE TABLE IF NOT EXISTS github_commits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  sha           TEXT UNIQUE NOT NULL,
  repo          TEXT NOT NULL,
  message       TEXT,
  additions     INT DEFAULT 0,
  deletions     INT DEFAULT 0,
  files_changed INT DEFAULT 0,
  committed_at  TIMESTAMPTZ NOT NULL,
  fetched_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RAW GITHUB PULL REQUESTS
CREATE TABLE IF NOT EXISTS github_prs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  pr_number       INT NOT NULL,
  repo            TEXT NOT NULL,
  title           TEXT,
  state           TEXT,        -- open | closed | merged
  review_count    INT DEFAULT 0,
  comments_count  INT DEFAULT 0,
  additions       INT DEFAULT 0,
  deletions       INT DEFAULT 0,
  opened_at       TIMESTAMPTZ,
  merged_at       TIMESTAMPTZ,
  fetched_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(repo, pr_number)
);

-- RAW JIRA ISSUES
CREATE TABLE IF NOT EXISTS jira_issues (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  issue_key       TEXT UNIQUE NOT NULL,
  summary         TEXT,
  issue_type      TEXT,        -- Story | Bug | Task | Spike
  status          TEXT,        -- To Do | In Progress | Done
  priority        TEXT,
  story_points    NUMERIC,
  original_estimate_hours NUMERIC,
  time_spent_hours        NUMERIC,
  labels          TEXT[],      -- used for skill tag extraction
  created_at      TIMESTAMPTZ,
  resolved_at     TIMESTAMPTZ,
  fetched_at      TIMESTAMPTZ DEFAULT NOW()
);

-- COMPUTED SKILL SCORES (one row per user per computation run)
CREATE TABLE IF NOT EXISTS skill_scores (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  computed_at       TIMESTAMPTZ DEFAULT NOW(),
  window_days       INT DEFAULT 90,
  skill_score       NUMERIC(5,2),   -- 0–100, final weighted score
  activity_score    NUMERIC(5,2),
  consistency_score NUMERIC(5,2),
  efficiency_score  NUMERIC(5,2),
  pr_quality_score  NUMERIC(5,2),
  top_skills        TEXT[],         -- e.g. ['Node.js','PostgreSQL','REST APIs']
  skill_gaps        TEXT[],         -- e.g. ['testing','docker']
  learning_path     JSONB,          -- [{step, title, reason, resource_url}]
  raw_metrics       JSONB           -- all intermediate numbers for transparency
);

-- SYNC LOG: track what was last fetched per user per source
CREATE TABLE IF NOT EXISTS sync_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  source      TEXT NOT NULL,   -- 'github' | 'jira'
  synced_at   TIMESTAMPTZ DEFAULT NOW(),
  status      TEXT,            -- 'ok' | 'error'
  error_msg   TEXT
);

CREATE INDEX IF NOT EXISTS idx_commits_user_date ON github_commits(user_id, committed_at);
CREATE INDEX IF NOT EXISTS idx_prs_user_date ON github_prs(user_id, opened_at);
CREATE INDEX IF NOT EXISTS idx_issues_user_date ON jira_issues(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_scores_user_date ON skill_scores(user_id, computed_at);
