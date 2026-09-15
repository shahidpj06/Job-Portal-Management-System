import type { Prisma, PrismaClient } from "../generated/prisma/client.js";

import { prisma } from "../database/index.js";
import type { ListUsersQuery } from "../schemas/user.schema.js";

const USER_DIRECTORY_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const UserDataService = {
  list: async (query: ListUsersQuery, database: PrismaClient = prisma) => {
    const searchTerms = query.search?.split(/\s+/).filter(Boolean) ?? [];

    const where: Prisma.UserWhereInput = {
      AND: searchTerms.map((term) => ({
        OR: [
          {
            firstName: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      })),
    };

    const [items, totalItems] = await database.$transaction(
      [
        database.user.findMany({
          where,
          select: USER_DIRECTORY_SELECT,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (query.page - 1) * query.limit,
          take: query.limit,
        }),
        database.user.count({ where }),
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
};
