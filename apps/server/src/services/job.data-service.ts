import type { Prisma, PrismaClient } from "../generated/prisma/client.js";

import { prisma } from "../database/index.js";
import type {
  CreateJobInput,
  ListJobsQuery,
  UpdateJobInput,
} from "../schemas/job.schema.js";
import { ApiError } from "../tools/api-error.js";
import {
  IJobListResult,
  IJobPaginationMetadata,
  JobData,
} from "../types/job.js";

const JOB_RELATIONS_INCLUDE = {
  _count: {
    select: {
      applications: true,
    },
  },
  company: true,
} satisfies Prisma.JobInclude;

const JOB_SORT_ORDER = "desc" as const;
const TEXT_SEARCH_MODE = "insensitive" as const;

type JobWithRelations = Prisma.JobGetPayload<{
  include: typeof JOB_RELATIONS_INCLUDE;
}>;

const jobDataFromRecord = (jobRecord: JobWithRelations): JobData => {
  const { _count: relationCounts, ...jobData } = jobRecord;

  return {
    ...jobData,
    applicationCount: relationCounts.applications,
  };
};

const jobNotFoundError = (): ApiError => {
  return new ApiError({
    statusCode: 404,
    code: "JOB_NOT_FOUND",
    message: "The requested job could not be found.",
  });
};

const jobPaginationMetadataBuild = (
  limit: number,
  page: number,
  totalItems: number,
): IJobPaginationMetadata => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    limit,
    page,
    totalItems,
    totalPages,
  };
};

const jobRecordGetById = async (
  jobId: string,
  database: PrismaClient,
): Promise<JobWithRelations> => {
  const jobRecord = await database.job.findUnique({
    where: {
      id: jobId,
    },
    include: JOB_RELATIONS_INCLUDE,
  });

  if (!jobRecord) {
    throw jobNotFoundError();
  }

  return jobRecord;
};

const jobSalaryRangeValidate = (
  input: UpdateJobInput,
  existingJob: JobWithRelations,
): void => {
  const salaryMaximum =
    input.salaryMax === undefined ? existingJob.salaryMax : input.salaryMax;

  const salaryMinimum =
    input.salaryMin === undefined ? existingJob.salaryMin : input.salaryMin;

  if (
    salaryMaximum !== null &&
    salaryMinimum !== null &&
    salaryMaximum < salaryMinimum
  ) {
    throw new ApiError({
      statusCode: 422,
      code: "INVALID_SALARY_RANGE",
      message: "Maximum salary cannot be lower than minimum salary.",
    });
  }
};

const jobWhereInputBuild = (query: ListJobsQuery): Prisma.JobWhereInput => {
  const searchFilter: Prisma.JobWhereInput | undefined = query.search
    ? {
        OR: [
          {
            company: {
              name: {
                contains: query.search,
                mode: TEXT_SEARCH_MODE,
              },
            },
          },
          {
            location: {
              contains: query.search,
              mode: TEXT_SEARCH_MODE,
            },
          },
          {
            summary: {
              contains: query.search,
              mode: TEXT_SEARCH_MODE,
            },
          },
          {
            title: {
              contains: query.search,
              mode: TEXT_SEARCH_MODE,
            },
          },
        ],
      }
    : undefined;

  return {
    category: query.category,
    experienceLevel: query.experienceLevel,
    ...searchFilter,
  };
};

export const JobDataService = {
  create: async (
    input: CreateJobInput,
    createdById: string,
    database: PrismaClient = prisma,
  ): Promise<JobData> => {
    const { companyId, ...jobInput } = input;

    const jobRecord = await database.job.create({
      data: {
        ...jobInput,
        company: {
          connect: {
            id: companyId,
          },
        },
        createdBy: {
          connect: {
            id: createdById,
          },
        },
      },
      include: JOB_RELATIONS_INCLUDE,
    });

    return jobDataFromRecord(jobRecord);
  },

  delete: async (
    jobId: string,
    database: PrismaClient = prisma,
  ): Promise<void> => {
    await jobRecordGetById(jobId, database);

    await database.job.delete({
      where: {
        id: jobId,
      },
    });
  },

  getById: async (
    jobId: string,
    database: PrismaClient = prisma,
  ): Promise<JobData> => {
    const jobRecord = await jobRecordGetById(jobId, database);

    return jobDataFromRecord(jobRecord);
  },

  list: async (
    query: ListJobsQuery,
    database: PrismaClient = prisma,
  ): Promise<IJobListResult> => {
    const where = jobWhereInputBuild(query);
    const skip = (query.page - 1) * query.limit;

    const [jobRecords, totalItems] = await database.$transaction([
      database.job.findMany({
        where,
        include: JOB_RELATIONS_INCLUDE,
        orderBy: {
          createdAt: JOB_SORT_ORDER,
        },
        skip,
        take: query.limit,
      }),
      database.job.count({
        where,
      }),
    ]);

    return {
      items: jobRecords.map(jobDataFromRecord),
      pagination: jobPaginationMetadataBuild(
        query.limit,
        query.page,
        totalItems,
      ),
    };
  },

  update: async (
    jobId: string,
    input: UpdateJobInput,
    database: PrismaClient = prisma,
  ): Promise<JobData> => {
    const existingJob = await jobRecordGetById(jobId, database);

    jobSalaryRangeValidate(input, existingJob);
    const { companyId, ...jobInput } = input;

    const updatedJobRecord = await database.job.update({
      where: {
        id: jobId,
      },
      data: {
        ...jobInput,
        ...(companyId
          ? {
              company: {
                connect: {
                  id: companyId,
                },
              },
            }
          : {}),
      },
      include: JOB_RELATIONS_INCLUDE,
    });

    return jobDataFromRecord(updatedJobRecord);
  },
};
