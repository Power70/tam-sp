CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at_id ON tasks (created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status_created_at_id
  ON tasks (status, created_at DESC, id DESC);

INSERT INTO tasks (title, description, status)
SELECT 'Welcome to Sprout', 'Create your first task to get started.', 'pending'
WHERE NOT EXISTS (SELECT 1 FROM tasks);
