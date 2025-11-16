-- Matches table (match history and results)
CREATE TABLE matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_type VARCHAR(20) NOT NULL CHECK (match_type IN ('TEAM_BATTLE', 'DRAFT_BATTLE')),
    home_user_id UUID REFERENCES users(id),
    away_user_id UUID REFERENCES users(id),
    home_team_id UUID REFERENCES teams(id),
    away_team_id UUID REFERENCES teams(id),
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    winner_user_id UUID REFERENCES users(id),
    match_events JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CHECK (match_type = 'DRAFT_BATTLE' OR (home_team_id IS NOT NULL AND away_team_id IS NOT NULL))
);

-- Performance indexes
CREATE INDEX idx_matches_home_user_id ON matches(home_user_id);
CREATE INDEX idx_matches_away_user_id ON matches(away_user_id);
CREATE INDEX idx_matches_created_at ON matches(created_at DESC);