-- Draft Players table (players selected during draft)
CREATE TABLE draft_players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    position_slot VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(draft_id, position_slot)
);

-- Performance index
CREATE INDEX idx_draft_players_draft_id ON draft_players(draft_id);