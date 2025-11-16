-- Teams table (user-created teams)
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    formation VARCHAR(10) NOT NULL CHECK (formation IN ('4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '4-2-2-2', '3-4-3')),
    playstyle VARCHAR(50) NOT NULL CHECK (playstyle IN ('Tiki-Taka', 'Counter', 'Long Ball', 'Total Football')),
    manager_id INTEGER REFERENCES managers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes
CREATE INDEX idx_teams_user_id ON teams(user_id);
CREATE INDEX idx_teams_manager_id ON teams(manager_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_team_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update team timestamp
CREATE TRIGGER trigger_update_team_timestamp
BEFORE UPDATE ON teams
FOR EACH ROW
EXECUTE FUNCTION update_team_timestamp();

-- Create view for team details
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