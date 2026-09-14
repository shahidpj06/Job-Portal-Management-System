export interface ICompany {
  createdAt: string;
  description: string | null;
  id: string;
  logoUrl: string | null;
  name: string;
  updatedAt: string;
  websiteUrl: string | null;
}

export interface ICompanyListResult {
  items: ICompany[];
}
