import type { AuthUser } from './auth';
import type { IPaginatedResult } from './common';

export interface IUserDirectoryItem extends AuthUser {
  createdAt: string;
}

export interface IUserDirectoryQuery {
  viewerId: string;
  page: number;
  limit: number;
  search?: string;
}

export type IUserDirectoryResult = IPaginatedResult<IUserDirectoryItem>;
