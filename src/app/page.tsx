import prismaClient from "@/clients/prisma";
import JobSearch from "@/components/JobSearch";
import { getQuery } from "@/utils/database";
import { Job } from "@prisma/client";
import { getHighlighter } from "shiki";

async function searchJobs(query: string, country: string): Promise<Job[]> {
  "use server";
  return await prismaClient.$queryRaw(getQuery(query, country));
}

async function getSqlString(query: string, country: string) {
  "use server";
  return getQuery(query, country).sql;
}

async function getHtml(lang: string, code: string) {
  "use server";
  const shiki = await getHighlighter({
    themes: ["github-light"],
    langs: [
      "bash",
      "sql",
      "python",
      "javascript",
      "typescript",
      "ruby",
      "java",
    ],
  });
  const html = shiki.codeToHtml(code, {
    lang,
    theme: "github-light",
  });
  return html;
}

export default function Home() {
  return (
    <main className="py-8 container">
      <h1 className="text-2xl mb-5">Search for a Startup Job</h1>
      <JobSearch
        searchJobs={searchJobs}
        getHtml={getHtml}
        getQuery={getSqlString}
      />
    </main>
  );
}
