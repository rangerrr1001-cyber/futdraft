-- Migration: Add managers table and update teams/drafts with manager_id

-- Create managers table
CREATE TABLE managers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    playstyle VARCHAR(50) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT playstyle_valid CHECK (playstyle IN ('Tiki-Taka', 'Counter', 'Long Ball', 'Total Football'))
);

CREATE INDEX idx_managers_playstyle ON managers(playstyle);

COMMENT ON TABLE managers IS 'Managers with fixed playstyles for battles';
COMMENT ON COLUMN managers.name IS 'Manager name (e.g., Pep Guardiola)';
COMMENT ON COLUMN managers.playstyle IS 'Fixed playstyle: Tiki-Taka, Counter, Long Ball, or Total Football';

-- Update teams table to add manager_id
ALTER TABLE teams ADD COLUMN manager_id INTEGER REFERENCES managers(id) ON DELETE SET NULL;
CREATE INDEX idx_teams_manager_id ON teams(manager_id);

COMMENT ON COLUMN teams.manager_id IS 'Selected manager for this team (determines playstyle)';

-- Update drafts table to add manager_id
ALTER TABLE drafts ADD COLUMN manager_id INTEGER REFERENCES managers(id) ON DELETE SET NULL;

COMMENT ON COLUMN drafts.manager_id IS 'Selected manager for this draft session';
