-- FUT Draft Database Setup
-- Complete database schema with all tables, indexes, and seed data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication and spin tracking
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_spin_date DATE,
    spin_count_today INTEGER DEFAULT 0
);

-- Positions reference table (10 positions)
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(3) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events reference table (6 events)
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OVR Ranges reference table (3 ranges)
CREATE TABLE IF NOT EXISTS ovr_ranges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL,
    min_ovr INTEGER NOT NULL,
    max_ovr INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players table (main player data)
CREATE TABLE IF NOT EXISTS players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(3) NOT NULL,
    event VARCHAR(20) NOT NULL,
    ovr INTEGER NOT NULL CHECK (ovr BETWEEN 40 AND 99),
    pace INTEGER NOT NULL CHECK (pace BETWEEN 0 AND 99),
    shooting INTEGER NOT NULL CHECK (shooting BETWEEN 0 AND 99),
    passing INTEGER NOT NULL CHECK (passing BETWEEN 0 AND 99),
    dribbling INTEGER NOT NULL CHECK (dribbling BETWEEN 0 AND 99),
    defending INTEGER NOT NULL CHECK (defending BETWEEN 0 AND 99),
    physical INTEGER NOT NULL CHECK (physical BETWEEN 0 AND 99),
    card_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Players table (inventory)
CREATE TABLE IF NOT EXISTS user_players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, player_id)
);

-- Managers table for tactics system
CREATE TABLE IF NOT EXISTS managers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    playstyle VARCHAR(50) NOT NULL CHECK (playstyle IN ('Tiki-Taka', 'Counter', 'Long Ball', 'Total Football')),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table (user-created teams)
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    formation VARCHAR(10) NOT NULL CHECK (formation IN ('4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '4-2-2-2', '3-4-3')),
    playstyle VARCHAR(50) NOT NULL CHECK (playstyle IN ('Tiki-Taka', 'Counter', 'Long Ball', 'Total Football')),
    manager_id INTEGER REFERENCES managers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Players table (team composition)
CREATE TABLE IF NOT EXISTS team_players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_player_id UUID NOT NULL REFERENCES user_players(id) ON DELETE CASCADE,
    position_slot VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, position_slot)
);

-- Drafts table (draft sessions)
CREATE TABLE IF NOT EXISTS drafts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    formation VARCHAR(10),
    manager_id INTEGER REFERENCES managers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP
);

-- Draft Players table (drafted players)
CREATE TABLE IF NOT EXISTS draft_players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    position_slot VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(draft_id, position_slot)
);

-- Matches table (match history)
CREATE TABLE IF NOT EXISTS matches (
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_last_spin_date ON users(last_spin_date);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_event ON players(event);
CREATE INDEX IF NOT EXISTS idx_players_ovr ON players(ovr);
CREATE INDEX IF NOT EXISTS idx_user_players_user_id ON user_players(user_id);
CREATE INDEX IF NOT EXISTS idx_user_players_acquired_at ON user_players(acquired_at DESC);
CREATE INDEX IF NOT EXISTS idx_managers_playstyle ON managers(playstyle);
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON teams(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_manager_id ON teams(manager_id);
CREATE INDEX IF NOT EXISTS idx_team_players_team_id ON team_players(team_id);
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_expires_at ON drafts(expires_at);
CREATE INDEX IF NOT EXISTS idx_draft_players_draft_id ON draft_players(draft_id);
CREATE INDEX IF NOT EXISTS idx_matches_home_user_id ON matches(home_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_user_id ON matches(away_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at DESC);

-- Position seed data
INSERT INTO positions (name) VALUES
('GK'), ('CB'), ('LB'), ('RB'), ('CDM'), ('CM'), ('CAM'), ('LW'), ('RW'), ('ST')
ON CONFLICT (name) DO NOTHING;

-- Events seed data
INSERT INTO events (name) VALUES
('TOTS'), ('TOTY'), ('ICY'), ('MAGICIANS'), ('HEROES'), ('RULEBREAKERS')
ON CONFLICT (name) DO NOTHING;

-- OVR Ranges seed data
INSERT INTO ovr_ranges (name, min_ovr, max_ovr) VALUES
('90+', 90, 99),
('85-89', 85, 89),
('80-84', 80, 84)
ON CONFLICT (name) DO NOTHING;

-- Managers seed data
INSERT INTO managers (name, playstyle, image_url) VALUES
('Pep Guardiola', 'Tiki-Taka', NULL),
('Luis Enrique', 'Tiki-Taka', NULL),
('Jose Mourinho', 'Counter', NULL),
('Diego Simeone', 'Counter', NULL),
('Jurgen Klopp', 'Long Ball', NULL),
('Sean Dyche', 'Long Ball', NULL),
('Roberto De Zerbi', 'Total Football', NULL),
('Marcelo Bielsa', 'Total Football', NULL)
ON CONFLICT (name) DO NOTHING;

-- Sample player seed data (54 players)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical, card_image_url) VALUES
-- Goalkeepers
('Alisson', 'GK', 'TOTY', 91, 83, 68, 78, 72, 92, 88, NULL),
('Ederson', 'GK', 'TOTS', 90, 81, 65, 76, 71, 90, 87, NULL),
('Courtois', 'GK', 'TOTY', 89, 78, 62, 74, 69, 88, 86, NULL),

-- Defenders
('Van Dijk', 'CB', 'TOTY', 92, 75, 60, 78, 72, 94, 91, NULL),
('Ramos', 'CB', 'TOTS', 88, 82, 73, 77, 75, 90, 87, NULL),
('De Ligt', 'CB', 'TOTS', 86, 76, 65, 74, 71, 88, 84, NULL),
('Robertson', 'LB', 'TOTS', 87, 88, 68, 82, 79, 85, 78, NULL),
('Alexander-Arnold', 'RB', 'TOTS', 88, 82, 71, 86, 83, 84, 80, NULL),

-- Midfielders
('De Bruyne', 'CM', 'TOTY', 94, 88, 92, 96, 90, 78, 82, NULL),
('Modric', 'CM', 'TOTS', 90, 85, 78, 92, 91, 82, 79, NULL),
('Kante', 'CDM', 'TOTS', 89, 91, 68, 80, 78, 90, 86, NULL),
('Pogba', 'CM', 'TOTS', 87, 82, 85, 88, 87, 80, 85, NULL),
('Eriksen', 'CAM', 'TOTS', 85, 83, 84, 87, 88, 78, 76, NULL),

-- Attackers
('Messi', 'RW', 'TOTY', 95, 87, 92, 92, 96, 78, 72, NULL),
('Ronaldo', 'ST', 'TOTY', 94, 91, 95, 86, 89, 82, 87, NULL),
('Neymar', 'LW', 'TOTY', 92, 95, 87, 88, 95, 75, 79, NULL),
('Mbappe', 'ST', 'TOTS', 91, 97, 88, 79, 91, 76, 83, NULL),
('Salah', 'RW', 'TOTS', 90, 93, 90, 83, 88, 78, 80, NULL),
('Haaland', 'ST', 'TOTS', 89, 88, 93, 78, 85, 79, 89, NULL),
('Lewandowski', 'ST', 'TOTS', 92, 85, 93, 86, 88, 83, 86, NULL),

-- Additional players for variety
('Kimmich', 'CDM', 'TOTY', 90, 82, 78, 88, 85, 89, 84, NULL),
('Neuer', 'GK', 'TOTS', 89, 78, 62, 74, 69, 88, 86, NULL),
('Davies', 'LB', 'TOTS', 86, 96, 72, 80, 83, 82, 79, NULL),
('Henderson', 'CM', 'TOTS', 86, 78, 70, 84, 82, 86, 84, NULL),
('Wijnaldum', 'CM', 'TOTS', 83, 85, 76, 82, 80, 84, 82, NULL),

-- ICY Event Players
('Sterling', 'LW', 'ICY', 87, 95, 82, 80, 88, 75, 76, NULL),
('Mendy', 'LB', 'ICY', 84, 90, 62, 76, 78, 84, 78, NULL),
('Silva', 'CM', 'ICY', 91, 76, 78, 91, 90, 82, 78, NULL),
('Firmino', 'ST', 'ICY', 86, 83, 83, 84, 87, 78, 81, NULL),

-- MAGICIANS Event Players
('Sancho', 'RW', 'MAGICIANS', 88, 92, 81, 84, 91, 75, 77, NULL),
('Havertz', 'CAM', 'MAGICIANS', 87, 84, 82, 86, 89, 79, 78, NULL),
('Werner', 'ST', 'MAGICIANS', 85, 94, 85, 79, 84, 76, 83, NULL),
('Ziyech', 'RW', 'MAGICIANS', 84, 82, 84, 88, 87, 74, 76, NULL),

-- HEROES Event Players
('Son', 'LW', 'HEROES', 89, 93, 85, 82, 90, 77, 79, NULL),
('Kane', 'ST', 'HEROES', 91, 82, 92, 84, 86, 81, 88, NULL),
('Aubameyang', 'ST', 'HEROES', 89, 94, 88, 76, 82, 75, 85, NULL),

-- RULEBREAKERS Event Players
('Bale', 'RW', 'RULEBREAKERS', 87, 93, 88, 78, 85, 75, 82, NULL),
('Griezmann', 'CAM', 'RULEBREAKERS', 86, 82, 84, 86, 88, 76, 78, NULL),
('Suarez', 'ST', 'RULEBREAKERS', 90, 84, 90, 83, 85, 79, 88, NULL),

-- Additional High OVR Players
('Kroos', 'CM', 'TOTS', 89, 71, 77, 93, 87, 82, 79, NULL),
('Thiago Silva', 'CB', 'TOTS', 88, 68, 52, 73, 68, 92, 84, NULL),
('Alba', 'LB', 'TOTS', 85, 88, 68, 82, 83, 81, 71, NULL),
('Carvajal', 'RB', 'TOTS', 84, 81, 70, 76, 78, 84, 76, NULL),
('Casemiro', 'CDM', 'TOTS', 88, 72, 74, 81, 78, 90, 89, NULL),
('Valverde', 'CM', 'TOTS', 84, 89, 76, 82, 83, 84, 84, NULL),

-- Additional Attackers
('Benzema', 'ST', 'TOTS', 90, 81, 89, 85, 88, 79, 85, NULL),
('Griezmann', 'CAM', 'TOTS', 89, 82, 84, 86, 88, 76, 78, NULL),
('Agüero', 'ST', 'TOTS', 90, 87, 92, 80, 85, 76, 81, NULL),
('Kane', 'ST', 'TOTS', 91, 82, 92, 84, 86, 81, 88, NULL),
('Mane', 'LW', 'TOTS', 90, 91, 87, 78, 89, 79, 83, NULL),

-- Additional Midfielders
('Frenkie de Jong', 'CM', 'TOTS', 86, 80, 75, 87, 89, 85, 80, NULL),
('Tchouaméni', 'CDM', 'TOTS', 84, 78, 71, 80, 78, 87, 86, NULL),
('Pedri', 'CM', 'TOTS', 85, 78, 74, 84, 87, 75, 76, NULL),
('Gavi', 'CM', 'TOTS', 82, 81, 71, 78, 84, 72, 77, NULL),

-- Additional Defenders
('Varane', 'CB', 'TOTS', 89, 82, 60, 76, 73, 91, 85, NULL),
('Koundé', 'CB', 'TOTS', 85, 84, 58, 74, 71, 86, 82, NULL),
('Aké', 'CB', 'TOTS', 83, 81, 60, 75, 72, 84, 81, NULL),
('Cancelo', 'RB', 'TOTS', 86, 88, 76, 82, 84, 82, 77, NULL)
ON CONFLICT (id) DO NOTHING;

-- Create function to reset daily spins
CREATE OR REPLACE FUNCTION reset_daily_spins()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_spin_date != OLD.last_spin_date OR NEW.last_spin_date IS NULL THEN
        NEW.spin_count_today = 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically reset spin count when date changes
CREATE TRIGGER trigger_reset_daily_spins
BEFORE UPDATE OF last_spin_date ON users
FOR EACH ROW
EXECUTE FUNCTION reset_daily_spins();

-- Create function to update updated_at timestamp for teams
CREATE OR REPLACE FUNCTION update_team_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update team timestamp
CREATE TRIGGER trigger_update_team_timestamp
BEFORE UPDATE ON teams
FOR EACH ROW
EXECUTE FUNCTION update_team_timestamp();

-- Create function to check and clean expired drafts
CREATE OR REPLACE FUNCTION clean_expired_drafts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM drafts WHERE expires_at < CURRENT_TIMESTAMP AND completed_at IS NULL;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create view for user inventory with player details
CREATE OR REPLACE VIEW user_player_inventory AS
SELECT
    up.id as inventory_id,
    up.user_id,
    up.acquired_at,
    p.id as player_id,
    p.name,
    p.position,
    p.event,
    p.ovr,
    p.pace,
    p.shooting,
    p.passing,
    p.dribbling,
    p.defending,
    p.physical,
    p.card_image_url
FROM user_players up
JOIN players p ON up.player_id = p.id
ORDER BY up.acquired_at DESC;

-- Create view for complete team details
CREATE OR REPLACE VIEW team_details AS
SELECT
    t.id as team_id,
    t.user_id,
    t.name as team_name,
    t.formation,
    t.playstyle,
    t.manager_id,
    m.name as manager_name,
    m.playstyle as manager_playstyle,
    t.created_at,
    t.updated_at
FROM teams t
LEFT JOIN managers m ON t.manager_id = m.id;

-- Create view for team players with full details
CREATE OR REPLACE VIEW team_player_details AS
SELECT
    tp.team_id,
    tp.position_slot,
    up.user_id,
    p.id as player_id,
    p.name as player_name,
    p.position as player_position,
    p.event,
    p.ovr,
    p.pace,
    p.shooting,
    p.passing,
    p.dribbling,
    p.defending,
    p.physical,
    p.card_image_url
FROM team_players tp
JOIN user_players up ON tp.user_player_id = up.id
JOIN players p ON up.player_id = p.id;

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts with authentication and spin tracking';
COMMENT ON TABLE positions IS 'Soccer positions (GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST)';
COMMENT ON TABLE events IS 'Card events (TOTS, TOTY, ICY, MAGICIANS, HEROES, RULEBREAKERS)';
COMMENT ON TABLE ovr_ranges IS 'Overall rating ranges for spin filtering';
COMMENT ON TABLE players IS 'Player cards with stats and information';
COMMENT ON TABLE user_players IS 'User inventory of acquired players';
COMMENT ON TABLE managers IS 'Manager data with fixed playstyles for tactics';
COMMENT ON TABLE teams IS 'User-created teams with formation and manager';
COMMENT ON TABLE team_players IS 'Team composition with position assignments';
COMMENT ON TABLE drafts IS 'Draft sessions with 30-minute expiry';
COMMENT ON TABLE draft_players IS 'Drafted players in temporary teams';
COMMENT ON TABLE matches IS 'Match history with events and results';

COMMIT;