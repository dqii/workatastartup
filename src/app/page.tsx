import prismaClient from '@/clients/prisma';
import JobSearch from '@/components/JobSearch';
import { getQuery, ExtendedJob } from '@/utils/database';
import { getHighlighter } from 'shiki';
import _ from 'lodash';

async function searchJobs(
  query: string,
  country: string
): Promise<ExtendedJob[]> {
  'use server';
  const jobs = await prismaClient.$queryRaw(getQuery(query, country));
  return (jobs as any[]).map((job) =>
    _.mapKeys(job, (v, k) => _.camelCase(k))
  ) as ExtendedJob[];
}

async function getSqlString(query: string, country: string) {
  'use server';
  return getQuery(query, country).sql;
}

async function getHtml(lang: string, code: string) {
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
    lang,
    theme: 'github-light',
  });
  return html;
}

export default function Home() {
  return (
    <JobSearch
      searchJobs={searchJobs}
      getHtml={getHtml}
      getQuery={getSqlString}
    />
  );
}
