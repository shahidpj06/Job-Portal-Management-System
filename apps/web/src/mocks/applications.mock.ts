import type { Application } from "../types";
import { mockJobs } from "./jobs.mock";
import { mockCandidate } from "./users.mock";

export const mockApplications: Application[] = [
  {
    id: "app_1",
    jobId: mockJobs[0].id,
    userId: mockCandidate.id,
    status: "SUBMITTED",
    appliedAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    job: mockJobs[0],
    user: mockCandidate,
  },
  {
    id: "app_2",
    jobId: mockJobs[2].id,
    userId: mockCandidate.id,
    status: "REVIEWING",
    appliedAt: new Date(Date.now() - (86400000 * 3)).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    job: mockJobs[2],
    user: mockCandidate,
  },
  {
    id: "app_3",
    jobId: mockJobs[4].id,
    userId: mockCandidate.id,
    status: "INTERVIEWING",
    appliedAt: new Date(Date.now() - (86400000 * 10)).toISOString(),
    updatedAt: new Date(Date.now() - (86400000 * 2)).toISOString(),
    job: mockJobs[4],
    user: mockCandidate,
  },
];
