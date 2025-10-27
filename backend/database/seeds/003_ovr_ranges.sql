-- Seed OVR ranges for spin feature
INSERT INTO ovr_ranges (label, min_ovr, max_ovr) VALUES
    ('90+', 90, 99),
    ('85-89', 85, 89),
    ('80-84', 80, 84)
ON CONFLICT (label) DO NOTHING;
