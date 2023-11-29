import { Prisma } from "@prisma/client";

export const getQuery = (query: string) => Prisma.sql`SELECT *
FROM
  jobs
ORDER BY
  text_embedding('BAAI/bge-large-en', ${query})
    <-> description_embedding
LIMIT 3`;
