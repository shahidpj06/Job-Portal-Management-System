import type { Job } from "./job";
import type { User } from "./user";

export type ApplicationStatus = "APPLIED" | "REVIEWING" | "INTERVIEWING" | "OFFER" | "REJECTED" | "HIRED";

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  
  // Included relations for mock convenience
  job?: Job;
  user?: User;
}
