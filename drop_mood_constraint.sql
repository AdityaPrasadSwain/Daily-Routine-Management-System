-- Drop old mood check constraint
-- Run this in pgAdmin or any PostgreSQL client connected to drms_db database

ALTER TABLE task_reviews DROP CONSTRAINT IF EXISTS task_reviews_mood_check;

-- Verify it was dropped
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelname = 'task_reviews' AND conname LIKE '%mood%';

-- This should return no rows if constraint was successfully dropped
