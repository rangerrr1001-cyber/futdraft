-- Positions reference table
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(3) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed positions data
INSERT INTO positions (name) VALUES
('GK'),   -- Goalkeeper
('CB'),   -- Center Back
('LB'),   -- Left Back
('RB'),   -- Right Back
('CDM'),  -- Central Defensive Midfielder
('CM'),   -- Central Midfielder
('CAM'),  -- Central Attacking Midfielder
('LW'),   -- Left Winger
('RW'),   -- Right Winger
('ST');   -- Striker