-- Drafts table (draft sessions with 30-minute expiry)
CREATE TABLE drafts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    formation VARCHAR(10),
    manager_id INTEGER REFERENCES managers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP
);

-- Performance indexes
CREATE INDEX idx_drafts_user_id ON drafts(user_id);
CREATE INDEX idx_drafts_expires_at ON drafts(expires_at);

-- Function to clean expired drafts
CREATE OR REPLACE FUNCTION clean_expired_drafts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM drafts WHERE expires_at < CURRENT_TIMESTAMP AND completed_at IS NULL;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;