-- Managers table for tactics system
CREATE TABLE managers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    playstyle VARCHAR(50) NOT NULL CHECK (playstyle IN ('Tiki-Taka', 'Counter', 'Long Ball', 'Total Football')),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for playstyle filtering
CREATE INDEX idx_managers_playstyle ON managers(playstyle);

-- Seed managers data (8 managers - 2 per playstyle)
INSERT INTO managers (name, playstyle, image_url) VALUES
('Pep Guardiola', 'Tiki-Taka', NULL),
('Luis Enrique', 'Tiki-Taka', NULL),
('Jose Mourinho', 'Counter', NULL),
('Diego Simeone', 'Counter', NULL),
('Jurgen Klopp', 'Long Ball', NULL),
('Sean Dyche', 'Long Ball', NULL),
('Roberto De Zerbi', 'Total Football', NULL),
('Marcelo Bielsa', 'Total Football', NULL);