-- Events reference table for card types
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed events data
INSERT INTO events (name) VALUES
('TOTS'),        -- Team of the Season
('TOTY'),        -- Team of the Year
('ICY'),         -- Icon Celebration
('MAGICIANS'),   -- Magic Moments
('HEROES'),      -- Heroes
('RULEBREAKERS'); -- Rulebreakers