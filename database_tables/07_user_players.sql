-- User Players table (inventory of acquired players)
CREATE TABLE user_players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, player_id)
);

-- Performance indexes
CREATE INDEX idx_user_players_user_id ON user_players(user_id);
CREATE INDEX idx_user_players_acquired_at ON user_players(acquired_at DESC);

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