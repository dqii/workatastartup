"use client";

import { useEffect, useState } from "react";
import CodeBlock from "./CodeBlock";
import JobPreview from "./JobPreview";
import JobView from "./JobView";
import { useDebounce } from "@uidotdev/usehooks";
import classNames from "classnames";
import { ExtendedJob } from "@/utils/database";

interface CountryButtonProps {
  children: string;
}

interface JobSearchProps {
  getHtml: (lang: string, code: string) => Promise<string>;
  searchJobs: (query: string, country: string) => Promise<ExtendedJob[]>;
  getQuery: (query: string, country: string) => Promise<string>;
}

const JobSearch = ({ getHtml, searchJobs, getQuery }: JobSearchProps) => {
  const [input, setInput] = useState(
    "I have been a software engineer for 5 years. I like React Native and have experience with Expo. I enjoy front end work in general, and I want to work at a later stage company."
  );
  const [country, setCountry] = useState("");

  const [job, setJob] = useState<ExtendedJob | undefined>();
  const [jobs, setJobs] = useState<ExtendedJob[]>([]);

  const [query, setQuery] = useState("");

  useEffect(() => {
    getQuery(input, country).then(setQuery);
  }, []);

  const debouncedInput = useDebounce(input, 1000);
  useEffect(() => {
    searchJobs(debouncedInput, country).then((jobs) => {
      setJobs(jobs);
      setJob(jobs[0]);
    });
  }, [debouncedInput, country]);

  const CountryButton = ({ children }: CountryButtonProps) => (
    <button
      className={classNames(
        "py-1 px-4 rounded-full text-sm",
        country === children
          ? "bg-stone-400 text-white"
          : "border border-stone-200 hover:bg-stone-50"
      )}
      onClick={() => setCountry(country === children ? "" : children)}
    >
      {children}
    </button>
  );

  return (
    <div className="flex gap-x-12">
      <div className="w-96 flex flex-col gap-y-8">
        <div>
          <p className="mb-3 text-lg">Tell us about your experience</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-stone-200 rounded text-stone-700 w-full h-28 p-2 text-sm"
          />
        </div>

        <div>
          <p className="mb-3 text-lg">Country Filter</p>
          <div className="flex gap-x-2">
            <CountryButton>US</CountryButton>
            <CountryButton>CA</CountryButton>
            <CountryButton>UK</CountryButton>
            <CountryButton>IN</CountryButton>
          </div>
        </div>

        <div>
          <p className="mb-3 text-lg">Generated SQL Query</p>
          <CodeBlock lang="sql" code={query} getHtml={getHtml} />
          <p className="mt-2 text-xs">Note: Replace ? with the inputs</p>
        </div>
      </div>

      <div className="w-full">
        <div>
          <p className="mb-3 text-lg">Results</p>
          <div className="grid grid-cols-3 gap-x-8">
            {jobs.map((job_, idx) => (
              <JobPreview
                key={job_.id}
                idx={idx + 1}
                job={job_}
                activeJob={job}
                setActiveJob={setJob}
              />
            ))}
          </div>
        </div>
        <div className="mt-10 border-t pt-10">
          {job && <JobView job={job} />}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
