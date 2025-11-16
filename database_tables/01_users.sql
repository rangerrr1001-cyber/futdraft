-- Users table for authentication and spin tracking
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_spin_date DATE,
    spin_count_today INTEGER DEFAULT 0
);

-- Index for username lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_last_spin_date ON users(last_spin_date);

-- Function to reset daily spins when date changes
CREATE OR REPLACE FUNCTION reset_daily_spins()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_spin_date != OLD.last_spin_date OR NEW.last_spin_date IS NULL THEN
        NEW.spin_count_today = 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically reset spin count
CREATE TRIGGER trigger_reset_daily_spins
BEFORE UPDATE OF last_spin_date ON users
FOR EACH ROW
EXECUTE FUNCTION reset_daily_spins();