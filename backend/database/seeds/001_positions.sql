-- Seed positions for spin feature
INSERT INTO positions (name) VALUES
    ('GK'),
    ('CB'),
    ('LB'),
    ('RB'),
    ('CDM'),
    ('CM'),
    ('CAM'),
    ('LW'),
    ('RW'),
    ('ST')
ON CONFLICT (name) DO NOTHING;
