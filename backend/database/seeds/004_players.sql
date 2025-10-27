-- Seed players with variety of positions, events, and OVR ratings
-- ~50 players covering all combinations for testing

-- TOTY Players (90+ OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Lionel Messi', 'RW', 'TOTY', 94, 85, 94, 91, 95, 35, 65),
    ('Cristiano Ronaldo', 'ST', 'TOTY', 93, 87, 94, 82, 87, 35, 78),
    ('Kevin De Bruyne', 'CAM', 'TOTY', 92, 76, 86, 93, 88, 61, 78),
    ('Kylian Mbappé', 'ST', 'TOTY', 91, 97, 89, 80, 92, 36, 77),
    ('Virgil van Dijk', 'CB', 'TOTY', 90, 75, 60, 70, 72, 91, 86),
    ('Thibaut Courtois', 'GK', 'TOTY', 90, 45, 11, 75, 11, 86, 78);

-- TOTS Players (85-89 OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Erling Haaland', 'ST', 'TOTS', 89, 89, 92, 65, 80, 45, 88),
    ('Mohamed Salah', 'RW', 'TOTS', 89, 93, 87, 81, 90, 45, 75),
    ('Robert Lewandowski', 'ST', 'TOTS', 88, 78, 92, 79, 86, 44, 82),
    ('Jude Bellingham', 'CM', 'TOTS', 87, 80, 75, 84, 84, 78, 82),
    ('Rodri', 'CDM', 'TOTS', 87, 62, 66, 79, 73, 84, 82),
    ('Trent Alexander-Arnold', 'RB', 'TOTS', 87, 76, 66, 89, 80, 76, 77),
    ('Ederson', 'GK', 'TOTS', 87, 48, 16, 85, 18, 82, 75),
    ('Casemiro', 'CDM', 'TOTS', 86, 62, 67, 75, 72, 87, 88),
    ('Bernardo Silva', 'CAM', 'TOTS', 86, 80, 75, 85, 90, 60, 73),
    ('Bukayo Saka', 'RW', 'TOTS', 85, 87, 78, 78, 87, 49, 70);

-- ICY Players (80-84 OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Phil Foden', 'CAM', 'ICY', 84, 85, 79, 83, 89, 60, 70),
    ('Darwin Núñez', 'ST', 'ICY', 84, 91, 82, 70, 80, 40, 81),
    ('Declan Rice', 'CDM', 'ICY', 84, 68, 63, 78, 75, 82, 84),
    ('Rúben Dias', 'CB', 'ICY', 83, 62, 50, 68, 70, 88, 83),
    ('Rafael Leão', 'LW', 'ICY', 83, 95, 76, 75, 88, 35, 74),
    ('Alisson Becker', 'GK', 'ICY', 83, 50, 13, 78, 15, 85, 80),
    ('João Cancelo', 'RB', 'ICY', 82, 85, 67, 82, 85, 72, 73),
    ('Bruno Fernandes', 'CAM', 'ICY', 82, 75, 80, 84, 82, 68, 75),
    ('Son Heung-min', 'LW', 'ICY', 82, 89, 84, 79, 86, 42, 69),
    ('Pedri', 'CM', 'ICY', 81, 72, 65, 83, 87, 63, 62),
    ('Marc-André ter Stegen', 'GK', 'ICY', 81, 47, 12, 80, 14, 84, 76),
    ('Nico Williams', 'LW', 'ICY', 80, 94, 72, 72, 82, 40, 68);

-- MAGICIANS Players (90+ OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Neymar Jr', 'LW', 'MAGICIANS', 91, 87, 83, 86, 94, 37, 61),
    ('Luka Modrić', 'CM', 'MAGICIANS', 90, 74, 76, 91, 90, 72, 65);

-- MAGICIANS Players (85-89 OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Vinícius Jr', 'LW', 'MAGICIANS', 89, 95, 78, 75, 92, 29, 67),
    ('Kai Havertz', 'CAM', 'MAGICIANS', 85, 78, 80, 81, 84, 56, 76);

-- MAGICIANS Players (80-84 OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Jamal Musiala', 'CAM', 'MAGICIANS', 84, 78, 76, 80, 88, 55, 70),
    ('Florian Wirtz', 'CAM', 'MAGICIANS', 83, 76, 79, 82, 86, 52, 68),
    ('Khvicha Kvaratskhelia', 'LW', 'MAGICIANS', 82, 89, 77, 76, 87, 38, 69);

-- HEROES Players (90+ OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Harry Kane', 'ST', 'HEROES', 90, 68, 92, 83, 83, 47, 83);

-- HEROES Players (85-89 OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Joshua Kimmich', 'CDM', 'HEROES', 89, 70, 71, 88, 84, 82, 76),
    ('Antonio Rüdiger', 'CB', 'HEROES', 87, 82, 55, 72, 70, 86, 86),
    ('Andrew Robertson', 'LB', 'HEROES', 87, 84, 60, 83, 80, 80, 77),
    ('Raphaël Varane', 'CB', 'HEROES', 86, 75, 47, 68, 68, 87, 80),
    ('Kyle Walker', 'RB', 'HEROES', 85, 90, 55, 71, 75, 78, 79);

-- HEROES Players (80-84 OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Alphonso Davies', 'LB', 'HEROES', 84, 96, 58, 76, 82, 73, 77),
    ('Gianluigi Donnarumma', 'GK', 'HEROES', 84, 50, 12, 75, 12, 83, 78),
    ('Federico Valverde', 'CM', 'HEROES', 83, 82, 77, 80, 81, 75, 83),
    ('Aurélien Tchouaméni', 'CDM', 'HEROES', 82, 74, 68, 77, 76, 82, 85),
    ('Jules Koundé', 'CB', 'HEROES', 82, 84, 50, 70, 72, 83, 78),
    ('William Saliba', 'CB', 'HEROES', 81, 78, 48, 68, 70, 84, 80);

-- RULEBREAKERS Players (90+ OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Karim Benzema', 'ST', 'RULEBREAKERS', 91, 77, 90, 83, 87, 40, 78);

-- RULEBREAKERS Players (85-89 OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Dušan Vlahović', 'ST', 'RULEBREAKERS', 85, 78, 85, 68, 75, 35, 83),
    ('Marcus Rashford', 'LW', 'RULEBREAKERS', 85, 93, 81, 75, 83, 44, 74),
    ('N\'Golo Kanté', 'CDM', 'RULEBREAKERS', 87, 77, 66, 75, 82, 87, 82),
    ('Mike Maignan', 'GK', 'RULEBREAKERS', 86, 52, 14, 76, 13, 83, 76);

-- RULEBREAKERS Players (80-84 OVR)
INSERT INTO players (name, position, event, ovr, pace, shooting, passing, dribbling, defending, physical) VALUES
    ('Rodrygo', 'RW', 'RULEBREAKERS', 84, 91, 78, 77, 87, 42, 66),
    ('Theo Hernández', 'LB', 'RULEBREAKERS', 84, 93, 68, 77, 80, 75, 82),
    ('Alexis Mac Allister', 'CM', 'RULEBREAKERS', 83, 75, 74, 82, 80, 76, 78),
    ('Enzo Fernández', 'CM', 'RULEBREAKERS', 83, 74, 73, 84, 82, 75, 73),
    ('Victor Osimhen', 'ST', 'RULEBREAKERS', 82, 92, 81, 68, 78, 38, 84),
    ('Joško Gvardiol', 'CB', 'RULEBREAKERS', 82, 78, 52, 72, 74, 82, 79),
    ('Diogo Costa', 'GK', 'RULEBREAKERS', 81, 48, 11, 73, 11, 81, 74),
    ('Jadon Sancho', 'RW', 'RULEBREAKERS', 81, 85, 74, 78, 86, 43, 63);
