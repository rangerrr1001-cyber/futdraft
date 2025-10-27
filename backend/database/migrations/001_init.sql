-- FUT Draft Database Schema
-- PostgreSQL 14+ required

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_spin_date DATE,
    spin_count_today INTEGER DEFAULT 0,
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 50)
);

CREATE INDEX idx_users_username ON users(username);

-- 2. Positions reference table
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL
);

-- 3. Events reference table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 4. OVR Ranges reference table
CREATE TABLE ovr_ranges (
    id SERIAL PRIMARY KEY,
    label VARCHAR(20) UNIQUE NOT NULL,
    min_ovr INTEGER NOT NULL,
    max_ovr INTEGER NOT NULL,
    CONSTRAINT ovr_range_valid CHECK (min_ovr <= max_ovr AND min_ovr >= 0 AND max_ovr <= 99)
);

-- 5. Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    position VARCHAR(10) NOT NULL,
    event VARCHAR(50) NOT NULL,
    ovr INTEGER NOT NULL,
    pace INTEGER,
    shooting INTEGER,
    passing INTEGER,
    dribbling INTEGER,
    defending INTEGER,
    physical INTEGER,
    card_image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT ovr_valid CHECK (ovr >= 50 AND ovr <= 99),
    CONSTRAINT stats_valid CHECK (
        pace >= 0 AND pace <= 99 AND
        shooting >= 0 AND shooting <= 99 AND
        passing >= 0 AND passing <= 99 AND
        dribbling >= 0 AND dribbling <= 99 AND
        defending >= 0 AND defending <= 99 AND
        physical >= 0 AND physical <= 99
    )
);

CREATE INDEX idx_players_position_event_ovr ON players(position, event, ovr);
CREATE INDEX idx_players_ovr ON players(ovr);
CREATE INDEX idx_players_position ON players(position);

-- 6. User Players table (inventory)
CREATE TABLE user_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_players_user_id ON user_players(user_id);
CREATE INDEX idx_user_players_acquired_at ON user_players(acquired_at DESC);

-- Note: Removed UNIQUE constraint to allow duplicate player ownership

-- 7. Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    formation VARCHAR(10) NOT NULL,
    playstyle VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT team_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 100)
);

CREATE INDEX idx_teams_user_id ON teams(user_id);

-- 8. Team Players table (team composition)
CREATE TABLE team_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_player_id UUID NOT NULL REFERENCES user_players(id) ON DELETE CASCADE,
    position_slot VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_team_position UNIQUE(team_id, position_slot)
);

CREATE INDEX idx_team_players_team_id ON team_players(team_id);

-- 9. Drafts table
CREATE TABLE drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    formation VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_drafts_user_id ON drafts(user_id);
CREATE INDEX idx_drafts_expires_at ON drafts(expires_at);

-- 10. Draft Players table
CREATE TABLE draft_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    position_slot VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_draft_position UNIQUE(draft_id, position_slot)
);

CREATE INDEX idx_draft_players_draft_id ON draft_players(draft_id);

-- 11. Matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_type VARCHAR(20) NOT NULL,
    home_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    away_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    home_team_id UUID,
    away_team_id UUID,
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    winner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    match_events JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    CONSTRAINT match_type_valid CHECK (match_type IN ('TEAM_BATTLE', 'DRAFT_BATTLE')),
    CONSTRAINT scores_valid CHECK (home_score >= 0 AND away_score >= 0)
);

CREATE INDEX idx_matches_home_user_id ON matches(home_user_id);
CREATE INDEX idx_matches_away_user_id ON matches(away_user_id);
CREATE INDEX idx_matches_created_at ON matches(created_at DESC);
CREATE INDEX idx_matches_match_type ON matches(match_type);

-- Comments for clarity
COMMENT ON TABLE users IS 'User accounts with authentication and spin tracking';
COMMENT ON TABLE players IS 'Player cards available in the game';
COMMENT ON TABLE user_players IS 'Players owned by users (inventory)';
COMMENT ON TABLE teams IS 'User-created teams for Team Battle';
COMMENT ON TABLE team_players IS 'Players assigned to specific positions in teams';
COMMENT ON TABLE drafts IS 'Temporary draft sessions';
COMMENT ON TABLE draft_players IS 'Players selected during draft sessions';
COMMENT ON TABLE matches IS 'Match history and results';
COMMENT ON TABLE positions IS 'Reference table for available positions';
COMMENT ON TABLE events IS 'Reference table for card events (TOTS, TOTY, etc.)';
COMMENT ON TABLE ovr_ranges IS 'Reference table for OVR ranges used in spin';
