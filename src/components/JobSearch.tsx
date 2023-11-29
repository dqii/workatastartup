"use client";

import { useEffect, useState } from "react";
import CodeBlock from "./CodeBlock";
import JobPreview from "./JobPreview";
import JobView from "./JobView";
import { Job } from "@prisma/client";
import { useDebounce } from "@uidotdev/usehooks";

const getQuery = () => `SELECT *
FROM
  jobs
ORDER BY
  text_embedding('BAAI/bge-large-en', :text)
    <-> description_embedding
LIMIT 3`;

interface JobSearchProps {
  getHtml: (lang: string, code: string) => Promise<string>;
  searchJobs: (query: string) => Promise<Job[]>;
}

const JobSearch = ({ getHtml, searchJobs }: JobSearchProps) => {
  const [input, setInput] = useState(
    "I have been a software engineer for 5 years. I like React Native and have experience with Expo. I enjoy front end work in general, and I want to work at a later stage company."
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const query = getQuery();

  const debouncedInput = useDebounce(input, 1000);
  useEffect(() => {
    if (debouncedInput.length > 10) {
      searchJobs(debouncedInput).then(setJobs);
    } else {
      setJobs([]);
    }
  }, [debouncedInput]);

  return (
    <div className="flex gap-x-12">
      <div className="w-96 flex flex-col gap-y-8">
        <div>
          <p className="mb-3 text-lg">Tell us about your experience</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-stone-400 rounded text-stone-700 w-full h-28 p-2 text-sm"
          />
        </div>

        <div>
          <p className="mb-3 text-lg">SQL Query</p>
          <CodeBlock lang="sql" code={query} getHtml={getHtml} />
        </div>

        <div>
          <p className="mb-3 text-lg">Results</p>
          <JobPreview />
          <JobPreview />
          <JobPreview />
        </div>
      </div>

      <div>
        <JobView />
      </div>
    </div>
  );
};

export default JobSearch;
