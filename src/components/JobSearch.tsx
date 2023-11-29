"use client";

import { useEffect, useState } from "react";
import CodeBlock from "./CodeBlock";
import JobPreview from "./JobPreview";
import JobView from "./JobView";
import { Job } from "@prisma/client";
import { useDebounce } from "@uidotdev/usehooks";

interface JobSearchProps {
  getHtml: (lang: string, code: string) => Promise<string>;
  searchJobs: (query: string) => Promise<Job[]>;
  getQuery: (query: string) => Promise<string>;
}

const JobSearch = ({ getHtml, searchJobs, getQuery }: JobSearchProps) => {
  const [input, setInput] = useState(
    "I have been a software engineer for 5 years. I like React Native and have experience with Expo. I enjoy front end work in general, and I want to work at a later stage company."
  );
  const [job, setJob] = useState<Job | undefined>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState("");

  const debouncedInput = useDebounce(input, 1000);
  useEffect(() => {
    if (debouncedInput.length > 10) {
      getQuery("?").then(setQuery);
      searchJobs(debouncedInput).then((jobs) => {
        setJobs(jobs);
        setJob(jobs[0]);
      });
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
          {jobs.map((job) => (
            <JobPreview key={job.id} job={job} />
          ))}
        </div>
      </div>

      <div>{job && <JobView job={job} />}</div>
    </div>
  );
};

export default JobSearch;
