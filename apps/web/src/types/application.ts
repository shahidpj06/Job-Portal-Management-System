import type { Job } from './job';
import type { User } from './user';

export type ApplicationStatus =
  'APPLIED' | 'REVIEWING' | 'INTERVIEWING' | 'OFFER' | 'REJECTED' | 'HIRED';

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

interface IApplicationRequestFields {
  jobId: string;
  coverLetter?: string;
}

export type ISubmitApplicationRequest = IApplicationRequestFields &
  (
    | {
        resumeSource: 'profile';
        resumeFileId: string;
        resumeUpdatedAt: string;
      }
    | {
        resumeSource: 'upload';
        file: File;
      }
  );

export interface IApplicationSubmissionResult {
  application: {
    id: string;
    jobId: string;
    userId: string;
    coverLetter: string | null;
    status: 'SUBMITTED';
    createdAt: string;
    resume: {
      filename: string;
      contentType: string;
      size: number;
    };
  };
}
