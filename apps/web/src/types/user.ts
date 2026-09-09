export type UserRole = "CANDIDATE" | "ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills?: string[];
  resumeUrl?: string;
  joinedAt: string;
}
