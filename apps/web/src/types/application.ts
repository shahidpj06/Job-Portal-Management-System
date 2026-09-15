import type { IPaginatedResult } from './common';
import type { IJobData, Job } from './job';
import type { IProfileData } from './profile';
import type { User } from './user';

export type ApplicationStatus =
  'SUBMITTED' | 'REVIEWING' | 'INTERVIEWING' | 'OFFER' | 'REJECTED' | 'HIRED';

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
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

export interface IApplicationListItem {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;

  job: Pick<IJobData, 'id' | 'title' | 'location' | 'status'> & {
    company: Pick<IJobData['company'], 'id' | 'name' | 'logoUrl'>;
  };

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  resume: {
    filename: string;
    contentType: string;
    size: number;
  } | null;
}

export interface IApplicationListArguments {
  viewerId: string;
  page: number;
  limit: number;
}

export type IApplicationListResult = IPaginatedResult<IApplicationListItem>;

export interface IAdminApplicationListArguments extends IApplicationListArguments {
  jobId?: string;
}

export interface IApplicationDetailsArguments {
  viewerId: string;
  applicationId: string;
}

export interface IApplicationDetails extends Omit<IApplicationListItem, 'user' | 'resume'> {
  coverLetter: string | null;

  user: Pick<
    IProfileData,
    'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'location' | 'headline' | 'bio' | 'skills'
  >;

  resume:
    | (NonNullable<IApplicationListItem['resume']> & {
        url: string;
        expiresAt: string;
      })
    | null;
}
