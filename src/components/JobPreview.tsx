export const job = {
  id: "63548-0",
  title: "GIS Technician",
  date: "2022-09-05T15:48:50.000Z",
  url: "https://www.ycombinator.com/companies/bunting-labs/jobs/tMHPptj-gis-technician?utm_source=syn_li",
  companyId: 82344341,
  companyName: "Bunting Labs",
  city: null,
  state: null,
  country: "US",
  description:
    "<p>We are looking for a GIS technician to create new geospatial data and do QA/QC on existing geospatial data in QGIS in support of our customers and internal software development. </p>\n\n<p>This job requires experience in QGIS.</p>\n",
  type: "CONTRACT",
  workplace: "Remote",
  salaryLow: 1000,
  salaryHigh: 10000,
  salaryLowCurrency: "USD",
  salaryHighCurrency: "USD",
};

export function formatLocation() {
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

export function formatLocationWithWorkplace() {
  const { workplace } = job;

  let location = formatLocation();
  if (workplace) {
    if (location) location += ` (${workplace})`;
    else location = workplace;
  }

  return location;
}

const JobPreview = () => {
  const location = formatLocationWithWorkplace();
  return (
    <div className="w-full border-b border-stone-200 p-4">
      <p className="text-lg font-medium">{job.title}</p>
      <p className="text-sm text-stone-500">{job.companyName}</p>
      {location && <p className="text-sm text-stone-500">{location}</p>}
    </div>
  );
};

export default JobPreview;
