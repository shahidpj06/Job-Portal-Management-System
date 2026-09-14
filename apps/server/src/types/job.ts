import type { Company, Job } from "../generated/prisma/client.js";

export type JobData = Job & {
  applicationCount: number;
  company: Company;
};

export type PublicJobData = Omit<JobData, "createdById">;

export interface IJobPaginationMetadata {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;
}

export interface IJobListResult {
  items: JobData[];
  pagination: IJobPaginationMetadata;
}

export interface IPublicJobListResult {
  items: PublicJobData[];
  pagination: IJobPaginationMetadata;
}
