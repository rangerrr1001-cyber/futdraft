-- Players table with complete player data
CREATE TABLE players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(3) NOT NULL REFERENCES positions(name),
    event VARCHAR(20) NOT NULL REFERENCES events(name),
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

-- Performance indexes
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_players_event ON players(event);
CREATE INDEX idx_players_ovr ON players(ovr);

-- Seed sample players data (54 players total)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical, card_image_url) VALUES
-- Goalkeepers (3)
('Alisson', 'GK', 'TOTY', 91, 83, 68, 78, 72, 92, 88, NULL),
('Ederson', 'GK', 'TOTS', 90, 81, 65, 76, 71, 90, 87, NULL),
('Courtois', 'GK', 'TOTY', 89, 78, 62, 74, 69, 88, 86, NULL),

-- Defenders (8)
('Van Dijk', 'CB', 'TOTY', 92, 75, 60, 78, 72, 94, 91, NULL),
('Ramos', 'CB', 'TOTS', 88, 82, 73, 77, 75, 90, 87, NULL),
('De Ligt', 'CB', 'TOTS', 86, 76, 65, 74, 71, 88, 84, NULL),
('Robertson', 'LB', 'TOTS', 87, 88, 68, 82, 79, 85, 78, NULL),
('Alexander-Arnold', 'RB', 'TOTS', 88, 82, 71, 86, 83, 84, 80, NULL),
('Davies', 'LB', 'TOTS', 86, 96, 72, 80, 83, 82, 79, NULL),
('Carvajal', 'RB', 'TOTS', 84, 81, 70, 76, 78, 84, 76, NULL),
('Varane', 'CB', 'TOTS', 89, 82, 60, 76, 73, 91, 85, NULL),

-- Midfielders (12)
('De Bruyne', 'CM', 'TOTY', 94, 88, 92, 96, 90, 78, 82, NULL),
('Modric', 'CM', 'TOTS', 90, 85, 78, 92, 91, 82, 79, NULL),
('Kante', 'CDM', 'TOTS', 89, 91, 68, 80, 78, 90, 86, NULL),
('Pogba', 'CM', 'TOTS', 87, 82, 85, 88, 87, 80, 85, NULL),
('Eriksen', 'CAM', 'TOTS', 85, 83, 84, 87, 88, 78, 76, NULL),
('Kimmich', 'CM', 'TOTS', 89, 71, 77, 93, 87, 82, 79, NULL),
('Henderson', 'CM', 'TOTS', 86, 78, 70, 84, 82, 86, 84, NULL),
('Silva', 'CM', 'TOTS', 91, 76, 78, 91, 90, 82, 78, NULL),
('Wijnaldum', 'CM', 'TOTS', 83, 85, 76, 82, 80, 84, 82, NULL),
('Frenkie de Jong', 'CM', 'TOTS', 86, 80, 75, 87, 89, 85, 80, NULL),
('Pedri', 'CM', 'TOTS', 85, 78, 74, 84, 87, 75, 76, NULL),
('Gavi', 'CM', 'TOTS', 82, 81, 71, 78, 84, 72, 77, NULL),

-- Attackers (16)
('Messi', 'RW', 'TOTY', 95, 87, 92, 92, 96, 78, 72, NULL),
('Ronaldo', 'ST', 'TOTY', 94, 91, 95, 86, 89, 82, 87, NULL),
('Neymar', 'LW', 'TOTY', 92, 95, 87, 88, 95, 75, 79, NULL),
('Mbappe', 'ST', 'TOTS', 91, 97, 88, 79, 91, 76, 83, NULL),
('Salah', 'RW', 'TOTS', 90, 93, 90, 83, 88, 78, 80, NULL),
('Haaland', 'ST', 'TOTS', 89, 88, 93, 78, 85, 79, 89, NULL),
('Lewandowski', 'ST', 'TOTS', 92, 85, 93, 86, 88, 83, 86, NULL),
('Benzema', 'ST', 'TOTS', 90, 81, 89, 85, 88, 79, 85, NULL),
('Griezmann', 'CAM', 'TOTS', 89, 82, 84, 86, 88, 76, 78, NULL),
('Agüero', 'ST', 'TOTS', 90, 87, 92, 80, 85, 76, 81, NULL),
('Kane', 'ST', 'TOTS', 91, 82, 92, 84, 86, 81, 88, NULL),
('Mane', 'LW', 'TOTS', 90, 91, 87, 78, 89, 79, 83, NULL),
('Sancho', 'RW', 'ICY', 87, 95, 82, 80, 88, 75, 76, NULL),
('Sterling', 'LW', 'ICY', 87, 93, 82, 80, 88, 75, 76, NULL),
('Mendy', 'LB', 'ICY', 84, 90, 62, 76, 78, 84, 78, NULL),
('Firmino', 'ST', 'ICY', 86, 83, 83, 84, 87, 78, 81, NULL),

-- Additional players for variety (15)
('Havertz', 'CAM', 'MAGICIANS', 87, 84, 82, 86, 89, 79, 78, NULL),
('Werner', 'ST', 'MAGICIANS', 85, 94, 85, 79, 84, 76, 83, NULL),
('Ziyech', 'RW', 'MAGICIANS', 84, 82, 84, 88, 87, 74, 76, NULL),
('Son', 'LW', 'HEROES', 89, 93, 85, 82, 90, 77, 79, NULL),
('Aubameyang', 'ST', 'HEROES', 89, 94, 88, 76, 82, 75, 85, NULL),
('Bale', 'RW', 'RULEBREAKERS', 87, 93, 88, 78, 85, 75, 82, NULL),
('Suarez', 'ST', 'RULEBREAKERS', 90, 84, 90, 83, 85, 79, 88, NULL),
('Thiago Silva', 'CB', 'TOTS', 88, 68, 52, 73, 68, 92, 84, NULL),
('Alba', 'LB', 'TOTS', 85, 88, 68, 82, 83, 81, 71, NULL),
('Casemiro', 'CDM', 'TOTS', 88, 72, 74, 81, 78, 90, 89, NULL),
('Valverde', 'CM', 'TOTS', 84, 89, 76, 82, 83, 84, 84, NULL),
('Tchouaméni', 'CDM', 'TOTS', 84, 78, 71, 80, 78, 87, 86, NULL),
('Koundé', 'CB', 'TOTS', 85, 84, 58, 74, 71, 86, 82, NULL),
('Aké', 'CB', 'TOTS', 83, 81, 60, 75, 72, 84, 81, NULL),
('Cancelo', 'RB', 'TOTS', 86, 88, 76, 82, 84, 82, 77, NULL);