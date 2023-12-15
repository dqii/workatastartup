import { Job, Prisma } from '@prisma/client';

export interface ExtendedJob extends Job {
  score: number;
}

export const getQuery = (
  longInput: string,
  shortInput: string,
  country: string
) => {
  return Prisma.sql`SELECT
${
  longInput
    ? Prisma.sql`*,
  cos_dist(
  text_embedding('BAAI/bge-small-en', ${longInput}),
  description_embedding_v2
) AS score`
    : Prisma.sql`  *`
}
FROM
  jobs
${
  shortInput && country
    ? Prisma.sql`WHERE
  country = ${country}
  AND websearch_to_tsquery('english', ${shortInput})
    @@ to_tsvector('english', description)`
    : country
    ? Prisma.sql`WHERE
  country = ${country}`
    : shortInput
    ? Prisma.sql`WHERE
  websearch_to_tsquery('english', ${shortInput})
    @@ to_tsvector('english', description)`
    : Prisma.empty
}
${
  longInput
    ? Prisma.sql`ORDER BY
  text_embedding('BAAI/bge-small-en', ${longInput})
    <=> description_embedding_v2`
    : shortInput
    ? Prisma.sql`ORDER BY
  ts_rank_cd(
    to_tsvector('english', description),
    websearch_to_tsquery('english', ${shortInput})
  ) DESC`
    : Prisma.sql`ORDER BY
  date DESC`
}
LIMIT 3`;
};
