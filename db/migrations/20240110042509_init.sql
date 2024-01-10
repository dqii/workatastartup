-- migrate:up
CREATE TABLE IF NOT EXISTS jobs (
    id                 TEXT PRIMARY KEY,
    title              TEXT,
    date               TIMESTAMP,
    url                TEXT,
    company_id         INTEGER,
    company_name       TEXT,
    city               TEXT,
    state              TEXT,
    country            TEXT,
    description        TEXT,
    type               TEXT,
    workplace          TEXT,
    salary_low         INTEGER,
    salary_high        INTEGER,
    salary_low_currency  TEXT,
    salary_high_currency TEXT,
    description_embedding REAL[],
    description_embedding_v2 REAL[]
);

-- migrate:down
DROP TABLE jobs;