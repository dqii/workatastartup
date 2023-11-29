"use client";

import { useState } from "react";
import CodeBlock from "./CodeBlock";
import JobPreview from "./JobPreview";

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
      <div className="w-96 flex flex-col gap-y-8">
        <div>
          <p className="mb-3 text-lg">Tell us about your experience</p>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-stone-400 rounded text-stone-700 w-full h-28 p-2 text-sm"
          />
        </div>

        <div>
          <p className="mb-3 text-lg">SQL Query</p>
          <CodeBlock lang="sql" code={QUERY} getHtml={getHtml} />
        </div>

        <div>
          <p className="mb-3 text-lg">Results</p>
          <JobPreview />
          <JobPreview />
          <JobPreview />
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default JobSearch;
