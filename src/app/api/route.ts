import { PrismaClient } from "@prisma/client";
import { parseString } from "xml2js";
import fs from "fs";

export const dynamic = "force-dynamic"; // defaults to force-static

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Hi");
  }

  // Initialize Prisma Client
  const prisma = new PrismaClient();

  // Read XML file
  const xmlData = fs.readFileSync(
    "/Users/diqi/lantern/workatastartup/job_feed.xml",
    "utf8"
  );

  // Parse XML data
  parseString(xmlData, (err, result) => {
    if (err) {
      console.error("Error parsing XML:", err);
      process.exit(1);
    }

    // Extract job data from parsed XML
    const jobs = result.source.job;

    // Iterate over each job element
    const data = jobs.map((job: any) => ({
      id: job.partnerJobId?.[0],
      title: job.title?.[0],
      date: job.date?.[0] ? new Date(job.date[0]) : null,
      url: job.applyUrl?.[0],
      companyId: parseInt(job.companyId?.[0]),
      companyName: job.company?.[0],
      city: job.city?.[0],
      state: job.state?.[0],
      country: job.country?.[0],
      description: job.description?.[0],
      type: job.jobtype?.[0],
      workplace: job.workplaceTypes?.[0],
      salaryLow:
        parseInt(
          job.salaries?.[0]?.salary?.[0]?.lowEnd?.[0]?.amount?.[0] || 0
        ) || null,
      salaryHigh:
        parseInt(
          job.salaries?.[0]?.salary?.[0]?.highEnd?.[0]?.amount?.[0] || "0"
        ) || null,
      salaryLowCurrency:
        job.salaries?.[0]?.salary?.[0]?.lowEnd?.[0]?.currencyCode?.[0],
      salaryHighCurrency:
        job.salaries?.[0]?.salary?.[0]?.highEnd?.[0]?.currencyCode?.[0],
    }));
    prisma.job.createMany({ data }).catch((error) => {
      console.error("Error inserting data:", error);
    });

    // Close Prisma Client connection
    prisma.$disconnect();
  });

  return new Response("Hi");
}
