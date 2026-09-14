import type { IPaginatedResult } from './common';
import type { ICompany } from './company';

export type EmploymentType = 'CONTRACT' | 'FREELANCE' | 'FULL_TIME' | 'INTERNSHIP' | 'PART_TIME';

export type ExperienceLevel =
  'DIRECTOR' | 'ENTRY_LEVEL' | 'EXECUTIVE' | 'MID_LEVEL' | 'SENIOR_LEVEL';

export type JobCategoryCode =
  'DESIGN' | 'ENGINEERING' | 'MARKETING' | 'OPERATIONS' | 'PRODUCT' | 'SALES';

export type JobStatus = 'CLOSED' | 'DRAFT' | 'PUBLISHED';
export type JobSort = 'newest' | 'highest_salary';
export type JobDatePosted = '24h' | '7d' | '30d';
export type WorkMode = 'HYBRID' | 'ON_SITE' | 'REMOTE';

/*
 * Temporary UI models used by the public mock-data pages.
 * Remove these after those pages are connected to the API.
 */
export interface SalaryRange {
  currency: string;
  max: number;
  min: number;
}

export interface JobCategory {
  description?: string;
  icon?: string;
  id: string;
  jobCount?: number;
  name: string;
}

export interface CompanyInfo {
  description?: string;
  logoUrl?: string;
  name: string;
  website?: string;
}

export interface Job {
  applicationCount: number;
  applicationDeadline?: string;
  benefits: string[];
  categoryId: string;
  company: CompanyInfo;
  createdAt: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  id: string;
  location: string;
  overview: string;
  requirements: string[];
  responsibilities: string[];
  salary: SalaryRange;
  skills: string[];
  status: JobStatus;
  title: string;
  updatedAt: string;
  workMode: WorkMode;
}

/*
 * Real backend API contracts.
 */

export interface IJobData {
  applicationCount: number;
  applicationDeadline: string | null;
  benefits: string[];
  category: JobCategoryCode;
  company: ICompany;
  createdAt: string;
  currency: string;
  description: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  id: string;
  location: string;
  requirements: string[];
  responsibilities: string[];
  salaryMax: number | null;
  salaryMin: number | null;
  skills: string[];
  status: JobStatus;
  summary: string;
  title: string;
  updatedAt: string;
  workMode: WorkMode;
}

export interface IJobListQuery {
  category?: JobCategoryCode;
  experienceLevel?: ExperienceLevel;
  limit?: number;
  page?: number;
  search?: string;
}

export interface IPublicJobListQuery
  extends Omit<IJobListQuery, 'experienceLevel'> {
  currency?: string;
  datePosted?: JobDatePosted;
  employmentType?: EmploymentType[];
  experienceLevel?: ExperienceLevel[];
  location?: string;
  minSalary?: number;
  sort?: JobSort;
  workMode?: WorkMode;
}

export interface ICreateJobRequest {
  applicationDeadline?: string | null;
  benefits?: string[];
  category: JobCategoryCode;
  companyId: string;
  currency?: string;
  description: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  location: string;
  requirements?: string[];
  responsibilities?: string[];
  salaryMax?: number | null;
  salaryMin?: number | null;
  skills?: string[];
  status?: JobStatus;
  summary: string;
  title: string;
  workMode: WorkMode;
}

export interface IUpdateJobMutationArguments {
  data: IUpdateJobRequest;
  jobId: string;
}

export type IUpdateJobRequest = Partial<ICreateJobRequest>;

export type IJobListResult = IPaginatedResult<IJobData>;

export interface IJobMutationResult {
  job: IJobData;
}
