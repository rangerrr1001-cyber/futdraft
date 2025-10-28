-- Seed events for spin feature
INSERT INTO events (name) VALUES
    ('TOTS'),
    ('TOTY'),
    ('ICY'),
    ('MAGICIANS'),
    ('HEROES'),
    ('RULEBREAKERS')
ON CONFLICT (name) DO NOTHING;
