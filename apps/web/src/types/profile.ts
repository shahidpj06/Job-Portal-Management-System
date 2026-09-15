export type ProfileUploadKind = 'avatar' | 'resume';

export interface IProfileFile {
  id: string;
  kind: 'AVATAR' | 'RESUME';
  filename: string;
  contentType: string;
  size: number;
  updatedAt: string;
}

export interface IProfileFileAccess extends IProfileFile {
  url: string;
  expiresAt: string;
}

export interface IProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  location: string | null;
  headline: string | null;
  bio: string | null;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  profileFiles: IProfileFile[];
}

export type IUpdateProfileRequest = Partial<
  Pick<
    IProfileData,
    'firstName' | 'lastName' | 'phone' | 'location' | 'headline' | 'bio' | 'skills'
  >
>;

export interface IUpdateProfileArguments {
  userId: string;
  data: IUpdateProfileRequest;
}

export interface IUploadProfileFileArguments {
  userId: string;
  kind: ProfileUploadKind;
  file: File;
}

export interface IProfileFileAccessArguments {
  userId: string;
  kind: ProfileUploadKind;
}
