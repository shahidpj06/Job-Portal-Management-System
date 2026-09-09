import "dotenv/config";
import { env } from "node:process";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  ApplicationStatus,
  EmploymentType,
  ExperienceLevel,
  JobCategory,
  JobStatus,
  PrismaClient,
  UserRole,
  WorkMode,
} from "../src/generated/prisma/client";

const databaseUrl = env.DIRECT_URL;

if (!databaseUrl) {
  throw new Error("DIRECT_URL is missing. Add it to apps/server/.env.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const jobSeeds = [
  {
    title: "Senior Backend Engineer",
    companyName: "Innovate AI",
    category: JobCategory.ENGINEERING,
    location: "Tokyo, Japan",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    experienceLevel: ExperienceLevel.SENIOR_LEVEL,
    salaryMin: 110000,
    salaryMax: 145000,
  },
  {
    title: "Frontend Developer",
    companyName: "Northstar Labs",
    category: JobCategory.ENGINEERING,
    location: "Remote",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 85000,
    salaryMax: 115000,
  },
  {
    title: "Cloud Infrastructure Engineer",
    companyName: "Vertex Systems",
    category: JobCategory.ENGINEERING,
    location: "Singapore",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    experienceLevel: ExperienceLevel.SENIOR_LEVEL,
    salaryMin: 120000,
    salaryMax: 155000,
  },
  {
    title: "Product Designer",
    companyName: "Studio Forge",
    category: JobCategory.DESIGN,
    location: "Remote",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 80000,
    salaryMax: 110000,
  },
  {
    title: "UX Researcher",
    companyName: "People First",
    category: JobCategory.DESIGN,
    location: "Bengaluru, India",
    employmentType: EmploymentType.CONTRACT,
    workMode: WorkMode.HYBRID,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 65000,
    salaryMax: 90000,
  },
  {
    title: "Senior Product Manager",
    companyName: "Momentum Works",
    category: JobCategory.PRODUCT,
    location: "Singapore",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    experienceLevel: ExperienceLevel.SENIOR_LEVEL,
    salaryMin: 115000,
    salaryMax: 150000,
  },
  {
    title: "Associate Product Manager",
    companyName: "Launchpad",
    category: JobCategory.PRODUCT,
    location: "Remote",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    experienceLevel: ExperienceLevel.ENTRY_LEVEL,
    salaryMin: 60000,
    salaryMax: 80000,
  },
  {
    title: "Growth Marketing Manager",
    companyName: "ScaleCraft",
    category: JobCategory.MARKETING,
    location: "Mumbai, India",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.ON_SITE,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 70000,
    salaryMax: 95000,
  },
  {
    title: "Content Marketing Specialist",
    companyName: "Brightside",
    category: JobCategory.MARKETING,
    location: "Remote",
    employmentType: EmploymentType.FREELANCE,
    workMode: WorkMode.REMOTE,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 50000,
    salaryMax: 70000,
  },
  {
    title: "Enterprise Account Executive",
    companyName: "Orbit Sales",
    category: JobCategory.SALES,
    location: "New York, NY",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    experienceLevel: ExperienceLevel.SENIOR_LEVEL,
    salaryMin: 95000,
    salaryMax: 135000,
  },
  {
    title: "Sales Development Representative",
    companyName: "Pipeline Pro",
    category: JobCategory.SALES,
    location: "Remote",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    experienceLevel: ExperienceLevel.ENTRY_LEVEL,
    salaryMin: 45000,
    salaryMax: 65000,
  },
  {
    title: "People Operations Manager",
    companyName: "Culture Collective",
    category: JobCategory.OPERATIONS,
    location: "Bengaluru, India",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 65000,
    salaryMax: 85000,
  },
  {
    title: "Customer Support Lead",
    companyName: "CareCloud",
    category: JobCategory.OPERATIONS,
    location: "Remote",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 55000,
    salaryMax: 75000,
  },
  {
    title: "Machine Learning Engineer",
    companyName: "Neural Path",
    category: JobCategory.ENGINEERING,
    location: "Tokyo, Japan",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    experienceLevel: ExperienceLevel.SENIOR_LEVEL,
    salaryMin: 125000,
    salaryMax: 165000,
  },
  {
    title: "Visual Designer",
    companyName: "Pixel & Co.",
    category: JobCategory.DESIGN,
    location: "Remote",
    employmentType: EmploymentType.PART_TIME,
    workMode: WorkMode.REMOTE,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 40000,
    salaryMax: 60000,
  },
  {
    title: "Business Operations Analyst",
    companyName: "ClearPath",
    category: JobCategory.OPERATIONS,
    location: "Singapore",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.ON_SITE,
    experienceLevel: ExperienceLevel.ENTRY_LEVEL,
    salaryMin: 55000,
    salaryMax: 70000,
  },
  {
    title: "Product Marketing Manager",
    companyName: "Signal House",
    category: JobCategory.MARKETING,
    location: "Remote",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    experienceLevel: ExperienceLevel.SENIOR_LEVEL,
    salaryMin: 90000,
    salaryMax: 120000,
  },
  {
    title: "Platform Engineer",
    companyName: "Foundation Stack",
    category: JobCategory.ENGINEERING,
    location: "Tokyo, Japan",
    employmentType: EmploymentType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    experienceLevel: ExperienceLevel.SENIOR_LEVEL,
    salaryMin: 120000,
    salaryMax: 160000,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("Password1234", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@jobnest.com" },
    update: {},
    create: {
      firstName: "Shahid",
      lastName: "Admin",
      email: "admin@jobnest.com",
      passwordHash,
      role: UserRole.ADMIN,
      location: "Tokyo, Japan",
      headline: "JobNest Administrator",
    },
  });

  const candidate = await prisma.user.upsert({
    where: { email: "candidate@jobnest.com" },
    update: {},
    create: {
      firstName: "Shahid",
      lastName: "Candidate",
      email: "candidate@jobnest.com",
      passwordHash,
      role: UserRole.USER,
      phone: "+81 90 1234 5678",
      location: "Tokyo, Japan",
      headline: "Frontend Developer",
      bio: "Product-minded frontend developer interested in meaningful work.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Accessibility"],
    },
  });

  await prisma.application.deleteMany({
    where: {
      userId: candidate.id,
    },
  });

  await prisma.job.deleteMany({
    where: {
      createdById: admin.id,
    },
  });

  const createdJobs = await Promise.all(
    jobSeeds.map((job, index) =>
      prisma.job.create({
        data: {
          ...job,
          currency: "USD",
          summary: `Join ${job.companyName} as a ${job.title} and help build products that make a measurable impact.`,
          description: `We are looking for a thoughtful ${job.title} to join our growing team. You will collaborate with talented people, solve meaningful problems, and help create excellent customer experiences.`,
          responsibilities: [
            "Build and improve high-quality product experiences.",
            "Collaborate with cross-functional partners.",
            "Contribute to thoughtful technical and product decisions.",
          ],
          requirements: [
            "Relevant professional experience or equivalent practical knowledge.",
            "Strong communication and collaboration skills.",
            "A quality-focused and customer-centered mindset.",
          ],
          skills: ["Communication", "Problem Solving", "Collaboration", "Agile"],
          benefits: [
            "Flexible working arrangements",
            "Learning and development budget",
            "Health and wellness support",
          ],
          applicationDeadline: daysFromNow(30 - index),
          createdAt: daysAgo(index + 1),
          status:
            index === jobSeeds.length - 1
              ? JobStatus.CLOSED
              : index === jobSeeds.length - 2
                ? JobStatus.DRAFT
                : JobStatus.PUBLISHED,
          createdById: admin.id,
        },
      }),
    ),
  );

  const publishedJobs = createdJobs.filter(
    (job) => job.status === JobStatus.PUBLISHED,
  );

  await prisma.application.createMany({
    data: [
      {
        userId: candidate.id,
        jobId: publishedJobs[0].id,
        status: ApplicationStatus.SUBMITTED,
        coverLetter:
          "I am excited to apply my React and TypeScript experience to this role.",
      },
      {
        userId: candidate.id,
        jobId: publishedJobs[3].id,
        status: ApplicationStatus.REVIEWING,
        coverLetter:
          "This opportunity strongly matches my product-minded development background.",
      },
    ],
  });

  console.log("Seed complete.");
  console.log("Admin: admin@jobnest.dev / Password123!");
  console.log("Candidate: candidate@jobnest.dev / Password123!");
  console.log(`Created ${createdJobs.length} jobs.`);
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });