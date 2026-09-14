import type { Company } from "../generated/prisma/client.js";

export interface ICompanyListResult {
  items: Company[];
}
