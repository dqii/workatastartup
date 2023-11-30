import { Prisma } from "@prisma/client";

export const getQuery = (query: string, country: string) =>
  country
    ? Prisma.sql`SELECT *
FROM
  jobs
WHERE
  country = ${country}
ORDER BY
  text_embedding('BAAI/bge-large-en', ${query})
    <-> description_embedding
LIMIT 3`
    : query
    ? Prisma.sql`SELECT *
FROM
  jobs
ORDER BY
  text_embedding('BAAI/bge-large-en', ${query})
    <-> description_embedding
LIMIT 3`
    : Prisma.sql`SELECT *
FROM
  jobs
LIMIT 3`;
