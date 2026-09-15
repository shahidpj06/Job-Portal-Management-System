import type { Prisma, PrismaClient } from "../generated/prisma/client.js";
import { UserRole } from "../generated/prisma/enums.js";

import { prisma } from "../database/index.js";
import type {
  ListAdminApplicationsQuery,
  ListCandidateApplicationsQuery,
} from "../schemas/application.schema.js";
import type { AuthenticatedUser } from "../types/auth.js";
import { ApiError } from "../tools/api-error.js";
import { PrivateFileStorageService } from "./private-file.storage-service.js";

const APPLICATION_LIST_SELECT = {
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,

  job: {
    select: {
      id: true,
      title: true,
      location: true,
      status: true,
      company: {
        select: {
          id: true,
          name: true,
          logoUrl: true,
        },
      },
    },
  },

  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },

  resume: {
    select: {
      filename: true,
      contentType: true,
      size: true,
    },
  },
} satisfies Prisma.ApplicationSelect;

const APPLICATION_DETAILS_SELECT = {
  ...APPLICATION_LIST_SELECT,
  coverLetter: true,

  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      location: true,
      headline: true,
      bio: true,
      skills: true,
    },
  },
} satisfies Prisma.ApplicationSelect;

const applicationNotFoundError = (): ApiError => {
  return new ApiError({
    statusCode: 404,
    code: "APPLICATION_NOT_FOUND",
    message: "The requested application could not be found.",
  });
};

const applicationAccessWhereBuild = (
  applicationId: string,
  viewer: AuthenticatedUser,
): Prisma.ApplicationWhereInput => {
  if (viewer.role === UserRole.ADMIN) {
    return { id: applicationId };
  }

  return {
    id: applicationId,
    userId: viewer.id,
  };
};

const listApplications = async (
  query: ListCandidateApplicationsQuery,
  where: Prisma.ApplicationWhereInput,
  database: PrismaClient,
) => {
  const skip = (query.page - 1) * query.limit;

  const [items, totalItems] = await database.$transaction(
    [
      database.application.findMany({
        where,
        select: APPLICATION_LIST_SELECT,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip,
        take: query.limit,
      }),

      database.application.count({ where }),
    ],
    {
      isolationLevel: "RepeatableRead",
    },
  );

  const totalPages = Math.ceil(totalItems / query.limit);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
};

export const ApplicationReadDataService = {
  listCandidateApplications: async (
    userId: string,
    query: ListCandidateApplicationsQuery,
    database: PrismaClient = prisma,
  ) => {
    return listApplications(query, { userId }, database);
  },

  listAdminApplications: async (
    query: ListAdminApplicationsQuery,
    database: PrismaClient = prisma,
  ) => {
    const where: Prisma.ApplicationWhereInput = {};

    if (query.jobId) {
      where.jobId = query.jobId;
    }

    return listApplications(query, where, database);
  },

  getApplicationDetails: async (
    applicationId: string,
    viewer: AuthenticatedUser,
    database: PrismaClient = prisma,
  ) => {
    const application = await database.application.findFirst({
      where: applicationAccessWhereBuild(applicationId, viewer),
      select: {
        ...APPLICATION_DETAILS_SELECT,
        resume: {
          select: {
            path: true,
            filename: true,
            contentType: true,
            size: true,
          },
        },
      },
    });

    if (!application) {
      throw applicationNotFoundError();
    }

    const { resume, ...applicationDetails } = application;

    if (!resume) {
      return {
        ...applicationDetails,
        resume: null,
      };
    }

    const { path, ...resumeDetails } = resume;

    const access = await PrivateFileStorageService.createDownloadUrl(
      application.user.id,
      "resume",
      path,
    );

    return {
      ...applicationDetails,
      resume: {
        ...resumeDetails,
        ...access,
      },
    };
  },
};
