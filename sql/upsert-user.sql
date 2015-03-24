-- BEGIN;
-- LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE;

WITH
upsert AS (
  UPDATE users
  SET github_user_data = $2
  WHERE github_id = $1
  RETURNING *
)

INSERT INTO users (github_id, github_user_data)
SELECT $1, $2
WHERE NOT EXISTS (
  SELECT 1
  FROM upsert
)
RETURNING *

-- COMMIT;
