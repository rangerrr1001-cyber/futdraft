-- Team Players table (team composition with 11 players per team)
CREATE TABLE team_players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_player_id UUID NOT NULL REFERENCES user_players(id) ON DELETE CASCADE,
    position_slot VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, position_slot)
);

-- Performance index
CREATE INDEX idx_team_players_team_id ON team_players(team_id);

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