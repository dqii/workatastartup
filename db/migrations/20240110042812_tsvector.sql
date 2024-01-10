-- migrate:up
ALTER TABLE jobs ADD COLUMN description_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(description, ''))) STORED;
CREATE INDEX ON jobs USING GIN (description_tsvector);

-- migrate:down
ALTER TABLE jobs DROP COLUMN IF EXISTS description_tsvector;