import type { PrismaClient } from "../generated/prisma/client.js";

import { prisma } from "../database/index.js";
import type { ICompanyListResult } from "../types/company.js";

const COMPANY_SORT_ORDER = "asc" as const;

export const CompanyDataService = {
  list: async (
    database: PrismaClient = prisma,
  ): Promise<ICompanyListResult> => {
    const companyRecords = await database.company.findMany({
      orderBy: {
        name: COMPANY_SORT_ORDER,
      },
    });

    return {
      items: companyRecords,
    };
  },
};
