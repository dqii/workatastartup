import { Job, Prisma } from '@prisma/client';

export interface ExtendedJob extends Job {
  score: number;
}

export const getQuery = (query: string, country: string) =>
  country
    ? Prisma.sql`SELECT
    *,
    cos_dist(
      text_embedding('BAAI/bge-small-en', ${query}),
      description_embedding_v2
    ) AS score
FROM
  jobs
WHERE
  country = ${country}
ORDER BY
  text_embedding('BAAI/bge-small-en', ${query})
    <=> description_embedding_v2
LIMIT 3`
    : query
    ? Prisma.sql`SELECT
  *,
  cos_dist(
    text_embedding('BAAI/bge-small-en', ${query}),
    description_embedding_v2
  ) AS score
FROM
  jobs
ORDER BY
  text_embedding('BAAI/bge-small-en', ${query})
    <=> description_embedding_v2
LIMIT 3`
    : Prisma.sql`SELECT *
FROM
  jobs
LIMIT 3`;
