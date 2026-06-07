BEGIN;

-- 1. Foreign Key Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_routine_id ON tasks(routine_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_social_logs_user_id ON social_media_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_social_budgets_user_id ON social_media_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_deep_work_user_id ON deep_work_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_alarms_task_id ON task_alarms(task_id);
CREATE INDEX IF NOT EXISTS idx_review_insights_wr_id ON review_insights(weekly_review_id);
CREATE INDEX IF NOT EXISTS idx_task_reviews_task_id ON task_reviews(task_id);

-- 2. Composite Indexes for Where Clauses
CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_social_logs_user_date ON social_media_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_reviews_user_date ON daily_reviews(user_id, date);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_user_start ON weekly_reviews(user_id, start_date);
CREATE INDEX IF NOT EXISTS idx_deep_work_user_time ON deep_work_sessions(user_id, start_time);

-- 3. Ordering / Sorting Indexes
CREATE INDEX IF NOT EXISTS idx_goal_reflections_goal_date ON goal_reflections(goal_id, reflection_date DESC);

-- 4. User Lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

COMMIT;
