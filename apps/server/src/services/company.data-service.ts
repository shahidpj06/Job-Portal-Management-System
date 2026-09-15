import type { Prisma, PrismaClient } from "../generated/prisma/client.js";

import { prisma } from "../database/index.js";
import type {
  CreateCompanyInput,
  ListCompaniesQuery,
  UpdateCompanyInput,
} from "../schemas/company.schema.js";
import { ApiError } from "../tools/api-error.js";

const COMPANY_SELECT = {
  id: true,
  name: true,
  description: true,
  logoUrl: true,
  websiteUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CompanySelect;

const companyNotFoundError = () =>
  new ApiError({
    statusCode: 404,
    code: "COMPANY_NOT_FOUND",
    message: "This company no longer exists.",
  });

const handleCompanyWriteError = (error: unknown): never => {
  if (error !== null && typeof error === "object" && "code" in error) {
    if (error.code === "P2002") {
      throw new ApiError({
        statusCode: 409,
        code: "COMPANY_NAME_EXISTS",
        message: "A company with this name already exists.",
      });
    }

    if (error.code === "P2003") {
      throw new ApiError({
        statusCode: 409,
        code: "COMPANY_HAS_JOBS",
        message:
          "This company is linked to existing jobs and cannot be deleted. Reassign or remove those jobs first.",
      });
    }

    if (error.code === "P2025") {
      throw companyNotFoundError();
    }
  }

  throw error;
};

export const CompanyDataService = {
  list: async (query: ListCompaniesQuery, database: PrismaClient = prisma) => {
    const where: Prisma.CompanyWhereInput = query.search
      ? {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        }
      : {};

    const [items, totalItems] = await database.$transaction(
      [
        database.company.findMany({
          where,
          select: COMPANY_SELECT,
          orderBy: [{ name: "asc" }, { id: "asc" }],
          skip: (query.page - 1) * query.limit,
          take: query.limit,
        }),
        database.company.count({ where }),
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
  },

  getById: async (companyId: string, database: PrismaClient = prisma) => {
    const company = await database.company.findUnique({
      where: { id: companyId },
      select: COMPANY_SELECT,
    });

    if (!company) {
      throw companyNotFoundError();
    }

    return company;
  },

  create: async (
    input: CreateCompanyInput,
    database: PrismaClient = prisma,
  ) => {
    try {
      return await database.company.create({
        data: {
          name: input.name,
          description: input.description,
          logoUrl: input.logoUrl,
          websiteUrl: input.websiteUrl,
        },
        select: COMPANY_SELECT,
      });
    } catch (error) {
      return handleCompanyWriteError(error);
    }
  },

  update: async (
    companyId: string,
    input: UpdateCompanyInput,
    database: PrismaClient = prisma,
  ) => {
    try {
      return await database.company.update({
        where: { id: companyId },
        data: {
          name: input.name,
          description: input.description,
          logoUrl: input.logoUrl,
          websiteUrl: input.websiteUrl,
        },
        select: COMPANY_SELECT,
      });
    } catch (error) {
      return handleCompanyWriteError(error);
    }
  },

  delete: async (companyId: string, database: PrismaClient = prisma) => {
    try {
      await database.company.delete({
        where: { id: companyId },
        select: { id: true },
      });
    } catch (error) {
      handleCompanyWriteError(error);
    }
  },
};
