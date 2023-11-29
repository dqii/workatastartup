import DOMPurify from "isomorphic-dompurify";
import { formatLocationWithWorkplace, job } from "./JobPreview";
import Link from "next/link";
import _ from "lodash";
import getSymbolFromCurrency from "currency-symbol-map";

function formatDate() {
  const { date } = job;
  if (!date) return;
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatSalaryRange() {
  const { salaryLow, salaryHigh, salaryLowCurrency, salaryHighCurrency } = job;
  let formattedSalary = "";

  if (salaryLow !== undefined && salaryHigh !== undefined) {
    const salaryLowStr = formatSalary(salaryLow, salaryLowCurrency);
    const salaryHighStr = formatSalary(salaryHigh, salaryHighCurrency);
    formattedSalary = `${salaryLowStr} - ${salaryHighStr}`;
  } else if (salaryLow !== undefined) {
    const salaryLowStr = formatSalary(salaryLow, salaryLowCurrency);
    formattedSalary = `${salaryLowStr} and above`;
  } else if (salaryHigh !== undefined) {
    const salaryHighStr = formatSalary(salaryHigh, salaryHighCurrency);
    formattedSalary = `${salaryHighStr} and below`;
  }

  return formattedSalary;
}

function formatSalary(amount: number, currency: string) {
  const currencySymbol = getSymbolFromCurrency(currency || "USD");
  return `${currencySymbol}${amount.toLocaleString()}`;
}

const JobView = () => {
  const location = formatLocationWithWorkplace();
  const dateString = formatDate();
  const salaryRange = formatSalaryRange();
  return (
    <div>
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-2xl mb-2">{job.title}</h2>
          <p>
            {job.companyName} · {location} · {_.capitalize(job.type)}
          </p>
          {salaryRange && <p className="mt-1">Compensation: {salaryRange}</p>}
        </div>
        <Link href={job.url}>
          <button className="bg-stone-700 rounded-full px-4 py-2 tracking-wide text-sm text-white">
            Apply
          </button>
        </Link>
      </div>

      <p className="text-lg mb-5">About the job</p>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(job.description),
        }}
      />

      {dateString && (
        <p className="mt-8 text-stone-400">Posted on {dateString}.</p>
      )}
    </div>
  );
};

export default JobView;
