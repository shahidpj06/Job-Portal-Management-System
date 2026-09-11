import { Job } from "../generated/prisma/client.js";

export type JobData = Job & {
  applicationCount: number;
};

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
    pagination: IJobPaginationMetadata
}