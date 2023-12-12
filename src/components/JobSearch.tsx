'use client';

import { useEffect, useState } from 'react';
import CodeBlock from './CodeBlock';
import JobPreview from './JobPreview';
import JobView from './JobView';
import { useDebounce } from '@uidotdev/usehooks';
import classNames from 'classnames';
import { ExtendedJob } from '@/utils/database';
import Link from 'next/link';
import { DEFAULT_INPUT } from '@/utils/constants';

interface CountryButtonProps {
  children: string;
}

interface JobSearchProps {
  getHtml: (lang: string, code: string) => Promise<string>;
  searchJobs: (query: string, country: string) => Promise<ExtendedJob[]>;
  getQuery: (query: string, country: string) => Promise<string>;
  defaultJobs: ExtendedJob[];
  defaultQuery: string;
}

const JobSearch = ({
  defaultJobs,
  defaultQuery,
  getHtml,
  searchJobs,
  getQuery,
}: JobSearchProps) => {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [country, setCountry] = useState('');

  const [job, setJob] = useState<ExtendedJob | undefined>(defaultJobs[0]);
  const [jobs, setJobs] = useState<ExtendedJob[]>(defaultJobs);

  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    getQuery(input, country).then(setQuery);
  }, []);

  const debouncedInput = useDebounce(input, 1000);
  useEffect(() => {
    searchJobs(debouncedInput, country).then((jobs) => {
      getQuery(debouncedInput, country).then(setQuery);
      setJobs(jobs);
      setJob(jobs[0]);
    });
  }, [debouncedInput, country]);

  const CountryButton = ({ children }: CountryButtonProps) => (
    <button
      className={classNames(
        'py-1 px-4 rounded-full text-sm',
        country === children
          ? 'bg-slate-400 text-white'
          : 'border border-slate-200 bg-white hover:bg-slate-100'
      )}
      onClick={() => setCountry(country === children ? '' : children)}
    >
      {children}
    </button>
  );

  return (
    <div className='flex'>
      <div className='w-[400px] px-5 flex flex-col gap-y-8 bg-slate-50 border-r-4 border-slate-100 min-h-screen'>
        <div>
          <div className='h-20 pt-8'>
            <h1 className='text-3xl font-bold'>Find a Startup Job</h1>
          </div>

          <p className='mb-3 text-lg'>Tell us about your experience</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='border border-slate-200 rounded text-slate-700 w-full h-28 p-2 text-sm'
          />
        </div>

        <div>
          <p className='mb-3 text-lg'>Country Filter</p>
          <div className='flex gap-x-2'>
            <CountryButton>US</CountryButton>
            <CountryButton>CA</CountryButton>
            <CountryButton>UK</CountryButton>
            <CountryButton>IN</CountryButton>
          </div>
        </div>

        <div>
          <p className='mb-3 text-lg'>Generated SQL Query</p>
          <CodeBlock lang='sql' code={query} getHtml={getHtml} />
          <p className='mt-2 text-xs'>Note: Replace ? with the inputs</p>
        </div>
      </div>

      <div className='w-full px-12'>
        <div>
          <div className='h-20 pt-8'>
            <h1 className='text-3xl'>
              💥 Vector generation and search powered by{' '}
              <Link href='https://lantern.dev' className='text-slate-400'>
                Lantern.dev
              </Link>
            </h1>
          </div>

          <p className='mb-3 text-lg'>Results</p>
          <div className='grid grid-cols-3 gap-x-8'>
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
        <div className='mt-10 border-t-2 border-slate-100 pt-10'>
          {job && <JobView job={job} />}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
