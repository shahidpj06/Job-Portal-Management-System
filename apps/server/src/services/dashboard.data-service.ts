import type { PrismaClient } from "../generated/prisma/client.js";
import { JobStatus } from "../generated/prisma/enums.js";

import { prisma } from "../database/index.js";

const getDashboardSummary = async (
  database: PrismaClient = prisma,
  now: Date = new Date(),
) => {
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );

  const nextMonthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );

  const [totalJobs, activeJobs, totalApplications, jobsPostedThisMonth] =
    await database.$transaction(
      [
        database.job.count(),

        database.job.count({
          where: {
            status: JobStatus.PUBLISHED,
          },
        }),

        database.application.count(),

        database.job.count({
          where: {
            createdAt: {
              gte: monthStart,
              lt: nextMonthStart,
            },
          },
        }),
      ],
      {
        isolationLevel: "RepeatableRead",
      },
    );

  return {
    totalJobs,
    activeJobs,
    totalApplications,
    jobsPostedThisMonth,
  };
};

export const DashboardDataService = {
  getDashboardSummary,
};
