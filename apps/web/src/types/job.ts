export type JobStatus = "PUBLISHED" | "DRAFT" | "CLOSED";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE" | "INTERNSHIP";
export type WorkMode = "REMOTE" | "HYBRID" | "ON_SITE";
export type ExperienceLevel = "ENTRY_LEVEL" | "MID_LEVEL" | "SENIOR_LEVEL" | "DIRECTOR" | "EXECUTIVE";

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface JobCategory {
  id: string;
  name: string;
  icon?: string;
  jobCount?: number;
  description?: string;
}

export interface CompanyInfo {
  name: string;
  logoUrl?: string;
  website?: string;
  description?: string;
}

export interface Job {
  id: string;
  title: string;
  company: CompanyInfo;
  categoryId: string;
  location: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  salary: SalaryRange;
  status: JobStatus;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  applicationDeadline?: string;
  postedAt: string;
  updatedAt: string;
  applicationCount: number;
}
