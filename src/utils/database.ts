export const getQuery = (
  longInput: string,
  shortInput: string,
  country: string
) => {
  const indexes = { longInput: 0, shortInput: 0, country: 0 };

  const params: string[] = [];
  if (longInput) {
    params.push(longInput);
    indexes.longInput = params.length;
  }
  if (shortInput) {
    params.push(shortInput);
    indexes.shortInput = params.length;
  }
  if (country) {
    params.push(country);
    indexes.country = params.length;
  }

  // Select
  const selectFields = ['*'];
  if (longInput) {
    selectFields.push(
      `cos_dist(\n\t\ttext_embedding('BAAI/bge-base-en', $${indexes.longInput}),\n\t\tdescription_embedding_v3\n\t) AS score`
    );
  }

  // Where
  const whereFields: string[] = [];
  if (country) {
    whereFields.push(`country = $${indexes.country}`);
  }
  if (shortInput) {
    whereFields.push(
      `websearch_to_tsquery('english', $${indexes.shortInput}) @@ description_tsvector`
    );
  }
  const whereQuery = whereFields.length
    ? `WHERE\n\t${whereFields.join('\n\tAND ')}\n`
    : '';

  // Order by
  let orderBy: string;
  if (longInput) {
    orderBy = `text_embedding('BAAI/bge-base-en', $${indexes.longInput}) <=> description_embedding_v3`;
  } else if (shortInput) {
    orderBy = `ts_rank_cd(description_tsvector, websearch_to_tsquery('english', $${indexes.shortInput})) DESC`;
  } else {
    orderBy = `date DESC`;
  }

  const selectQuery = selectFields.join(',\n\t');

  const query = `SELECT
\t${selectQuery}
FROM
\tjobs
${whereQuery}ORDER BY
\t${orderBy}
LIMIT 3`;

  return { query, params };
};
