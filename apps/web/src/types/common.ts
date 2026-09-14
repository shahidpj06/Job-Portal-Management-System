export interface IPaginationMetaData {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;
}

export interface IPaginatedResult<Data> {
  items: Data[];
  pagination: IPaginationMetaData;
}
