-- Seed: 8 Managers (2 per playstyle)

INSERT INTO managers (name, playstyle, image_url) VALUES
-- Tiki-Taka Managers
('Pep Guardiola', 'Tiki-Taka', NULL),
('Luis Enrique', 'Tiki-Taka', NULL),

-- Counter Managers
('Jose Mourinho', 'Counter', NULL),
('Diego Simeone', 'Counter', NULL),

-- Long Ball Managers
('Jurgen Klopp', 'Long Ball', NULL),
('Sean Dyche', 'Long Ball', NULL),

-- Total Football Managers
('Roberto De Zerbi', 'Total Football', NULL),
('Marcelo Bielsa', 'Total Football', NULL);

-- Verify inserted data
SELECT id, name, playstyle FROM managers ORDER BY id;
