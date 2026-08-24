CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  timezone      VARCHAR(50)  NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habits (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);

CREATE TABLE IF NOT EXISTS check_ins (
  id            SERIAL PRIMARY KEY,
  habit_id      INTEGER     NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id       INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  local_date    DATE        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_habit_local_date UNIQUE (habit_id, local_date)
);

CREATE INDEX IF NOT EXISTS idx_checkins_habit_date ON check_ins (habit_id, local_date DESC);
