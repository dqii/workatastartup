import prismaClient from '@/clients/prisma';
import JobSearch from '@/components/JobSearch';
import { getQuery, ExtendedJob } from '@/utils/database';
import { getHighlighter } from 'shikiji';
import _ from 'lodash';
import { DEFAULT_LONG_INPUT, DEFAULT_SHORT_INPUT } from '@/utils/constants';

async function searchJobs(
  longInput: string,
  shortInput: string,
  country: string
): Promise<ExtendedJob[]> {
  'use server';
  const query = getQuery(longInput, shortInput, country);
  const jobs = await prismaClient.$queryRaw(query);
  return (jobs as any[]).map((job) =>
    _.mapKeys(job, (v, k) => _.camelCase(k))
  ) as ExtendedJob[];
}

async function getSqlString(
  longInput: string,
  shortInput: string,
  country: string
) {
  'use server';
  return getQuery(longInput, shortInput, country).sql;
}

async function getHtml(code: string) {
  'use server';
  const shiki = await getHighlighter({
    themes: ['github-light'],
    langs: [
      'bash',
      'sql',
      'python',
      'javascript',
      'typescript',
      'ruby',
      'java',
    ],
  });
  const html = shiki.codeToHtml(code, {
    lang: 'sql',
    theme: 'github-light',
  });
  return html;
}

export default async function Home() {
  const jobs = await searchJobs(DEFAULT_LONG_INPUT, DEFAULT_SHORT_INPUT, '');
  const query = await getSqlString(DEFAULT_LONG_INPUT, DEFAULT_SHORT_INPUT, '');
  const html = await getHtml(query);
  return (
    <JobSearch
      defaultJobs={jobs}
      defaultQuery={query}
      defaultHtml={html}
      searchJobs={searchJobs}
      getHtml={getHtml}
      getQuery={getSqlString}
    />
  );
}
