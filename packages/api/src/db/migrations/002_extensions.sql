-- Telemetry events table
CREATE TABLE IF NOT EXISTS telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- deploy, error, rollback
    severity VARCHAR(50) NOT NULL, -- low, medium, high
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Graph relations table
CREATE TABLE IF NOT EXISTS user_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    related_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL, -- collaborated
    weight INTEGER DEFAULT 1,
    last_interaction TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (user_id, related_user_id, relation_type)
);

-- NLP keyword storage inside existing synced tables (safe alter)
ALTER TABLE github_commits ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE jira_issues ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';

-- Expand skill_scores table strictly to hold our new payload metric outputs
ALTER TABLE skill_scores ADD COLUMN IF NOT EXISTS telemetry_modifier DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE skill_scores ADD COLUMN IF NOT EXISTS collaboration_score DECIMAL(5,2) DEFAULT 0.0;
