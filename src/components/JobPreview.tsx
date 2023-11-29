import { Job } from "@prisma/client";

export function formatLocation(job: Job) {
  const { city, state, country } = job;
  let location = "";

  if (city) {
    location += city;
    if (state) location += `, ${state}`;
    if (country) location += `, ${country}`;
  } else if (state) {
    location += state;
    if (country) location += `, ${country}`;
  } else if (country) {
    location += country;
  }

  return location;
}

export function formatLocationWithWorkplace(job: Job) {
  const { workplace } = job;

  let location = formatLocation(job);
  if (workplace) {
    if (location) location += ` (${workplace})`;
    else location = workplace;
  }

  return location;
}

interface JobPreviewProps {
  job: Job;
}

const JobPreview = ({ job }: JobPreviewProps) => {
  const location = formatLocationWithWorkplace(job);
  return (
    <div className="w-full border-b border-stone-200 p-3 hover:bg-stone-50">
      <p className="font-medium">{job.title}</p>
      <p className="text-sm text-stone-500">{job.companyName}</p>
      {location && <p className="text-sm text-stone-500">{location}</p>}
    </div>
  );
};

export default JobPreview;
