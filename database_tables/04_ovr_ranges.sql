-- OVR Ranges reference table for spin filtering
CREATE TABLE ovr_ranges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL,
    min_ovr INTEGER NOT NULL,
    max_ovr INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed OVR ranges data
INSERT INTO ovr_ranges (name, min_ovr, max_ovr) VALUES
('90+', 90, 99),    -- Elite players (90-99)
('85-89', 85, 89),   -- High-rated players (85-89)
('80-84', 80, 84);   -- Good players (80-84)