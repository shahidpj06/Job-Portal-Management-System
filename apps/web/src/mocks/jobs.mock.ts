import type { Job } from "../types";
import { mockCategories } from "./categories.mock";

const generateMockJobs = (): Job[] => {
  const jobs: Job[] = [];
  const companies = [
    { name: "TechCorp", logoUrl: "" },
    { name: "Innovate AI", logoUrl: "" },
    { name: "Global Finance", logoUrl: "" },
    { name: "HealthPlus", logoUrl: "" },
    { name: "EcoEnergy", logoUrl: "" },
    { name: "Retail Giant", logoUrl: "" },
  ];

  const titles = [
    "Frontend Developer", "Backend Engineer", "Full Stack Developer", "DevOps Engineer",
    "Product Designer", "UX Researcher", "Product Manager", "Data Scientist",
    "Machine Learning Engineer", "Marketing Specialist", "Sales Representative",
    "Operations Manager", "HR Generalist", "Customer Support Lead", "Financial Analyst",
    "Security Consultant", "Mobile App Developer", "Cloud Architect"
  ];

  for (let i = 0; i < 24; i++) {
    const categoryId = mockCategories[i % mockCategories.length].id;
    const company = companies[i % companies.length];
    const title = titles[i % titles.length];

    jobs.push({
      id: `job_${i + 1}`,
      title,
      company,
      categoryId,
      location: i % 3 === 0 ? "Remote" : i % 2 === 0 ? "New York, NY" : "San Francisco, CA",
      employmentType: i % 5 === 0 ? "CONTRACT" : "FULL_TIME",
      workMode: i % 3 === 0 ? "REMOTE" : i % 2 === 0 ? "HYBRID" : "ON_SITE",
      experienceLevel: i % 4 === 0 ? "ENTRY_LEVEL" : i % 3 === 0 ? "SENIOR_LEVEL" : "MID_LEVEL",
      salary: {
        min: 80000 + (i * 5000),
        max: 120000 + (i * 6000),
        currency: "USD",
      },
      status: i % 10 === 0 ? "CLOSED" : i % 8 === 0 ? "DRAFT" : "PUBLISHED",
      overview: `We are looking for a skilled ${title} to join our growing team at ${company.name}. You will be responsible for key deliverables and driving innovation.`,
      responsibilities: [
        "Develop and maintain high-quality solutions.",
        "Collaborate with cross-functional teams.",
        "Participate in code and design reviews."
      ],
      requirements: [
        "Bachelor's degree in a relevant field or equivalent experience.",
        "Proven experience in a similar role.",
        "Strong communication and problem-solving skills."
      ],
      skills: ["Teamwork", "Communication", "Problem Solving", "Agile"],
      benefits: ["Health Insurance", "401k Match", "Flexible PTO", "Remote Work Options"],
      createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
      updatedAt: new Date(Date.now() - (i * 86400000)).toISOString(),
      applicationCount: Math.floor(Math.random() * 50),
    });
  }

  return jobs;
};

export const mockJobs: Job[] = generateMockJobs();
