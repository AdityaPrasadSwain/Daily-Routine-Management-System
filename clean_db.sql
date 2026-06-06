-- ==========================================
-- DANGER: DATA LOSS SCRIPT
-- USE THIS TO FIX MIGRATION ERRORS BY RESETTING SCHEMA
-- ==========================================

DROP TABLE IF EXISTS task_reviews CASCADE;
DROP TABLE IF EXISTS task_alarms CASCADE;
DROP TABLE IF EXISTS routine_tasks CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS routines CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop sequences if they exist to reset ID generation
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS routines_id_seq CASCADE;
DROP SEQUENCE IF EXISTS tasks_id_seq CASCADE;
DROP SEQUENCE IF EXISTS goals_id_seq CASCADE;
