import type { IPaginatedResult } from './common';

export interface ICompany {
  createdAt: string;
  description: string | null;
  id: string;
  logoUrl: string | null;
  name: string;
  updatedAt: string;
  websiteUrl: string | null;
}

export interface ICompanyListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export type ICompanyListResult = IPaginatedResult<ICompany>;

export type ICreateCompanyRequest = Pick<ICompany, 'name'> &
  Partial<Pick<ICompany, 'description' | 'websiteUrl'>>;

export type IUpdateCompanyRequest = Partial<ICreateCompanyRequest>;

export interface IUpdateCompanyArguments {
  companyId: string;
  data: IUpdateCompanyRequest;
}

export interface ICompanyMutationResult {
  company: ICompany;
}
