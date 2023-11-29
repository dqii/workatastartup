"use client";

import { useState } from "react";
import CodeBlock from "./CodeBlock";

const QUERY = `SELECT
  *
FROM
  jobs
WHERE
  type = 'REMOTE'
ORDER BY
  embed($text) <-> description_embedding`;

interface JobSearchProps {
  getHtml: (lang: string, code: string) => Promise<string>;
  searchJob: (query: string) => Promise<void>;
}

const JobSearch = ({ getHtml, searchJob }: JobSearchProps) => {
  const [query, setQuery] = useState(
    "I have been a software engineer for 5 years. I like React Native and have experience with Expo. I enjoy front end work in general, and I want to work at a later stage company."
  );
  return (
    <div className="flex gap-x-8">
      <div className="border border-stone-400 w-80 p-4">
        <p className="mb-3">Tell us about your experience</p>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-stone-400 rounded text-stone-700 w-full h-40 p-2"
        />

        <p className="mb-3 mt-6">Filters</p>
      </div>

      <div>
        <p className="text-xl">Results</p>
        <CodeBlock lang="sql" code={QUERY} getHtml={getHtml} />
      </div>
    </div>
  );
};

export default JobSearch;
