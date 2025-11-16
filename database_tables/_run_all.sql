-- Run all database table creation scripts
-- Execute in this order to maintain foreign key dependencies

-- Enable UUID extension first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run table creation scripts in order
\i 01_users.sql
\i 02_positions.sql
\i 03_events.sql
\i 04_ovr_ranges.sql
\i 05_players.sql
\i 06_managers.sql
\i 07_user_players.sql
\i 08_teams.sql
\i 09_team_players.sql
\i 10_drafts.sql
\i 11_draft_players.sql
\i 12_matches.sql

-- Commit all changes
COMMIT;

-- Display verification queries
\echo '=== Database Setup Complete ==='
\echo 'Verifying table counts:'
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'positions', COUNT(*) FROM positions
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'ovr_ranges', COUNT(*) FROM ovr_ranges
UNION ALL
SELECT 'players', COUNT(*) FROM players
UNION ALL
SELECT 'managers', COUNT(*) FROM managers;

\echo '=== All tables created successfully ==='