CREATE EXTENSION "uuid-ossp";

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_id TEXT NOT NULL UNIQUE,
  github_user_data JSON NOT NULL
);
