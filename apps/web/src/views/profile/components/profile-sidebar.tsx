import { Edit, FileText, LoaderCircle, Mail, MapPin, Phone } from 'lucide-react';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Field } from '@/components/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { IProfileData, IProfileFile } from '@/types';
import { getInitials } from '@/utils/formatters';

interface IProfileSidebarProps {
  profile: IProfileData;
  avatarUrl?: string;
  isDownloadingResume: boolean;
  onEdit: () => void;
  onDownloadResume: () => void;
  onUploadAvatar: (file: File) => Promise<IProfileFile>;
}

interface IProfileAvatarValues {
  avatar: IProfileFile | null;
}

export const ProfileSidebar = (props: IProfileSidebarProps) => {
  const { profile, avatarUrl, isDownloadingResume, onEdit, onDownloadResume, onUploadAvatar } =
    props;

  const initials = useMemo(
    () => getInitials(profile.firstName, profile.lastName),
    [profile.firstName, profile.lastName]
  );

  const resume = useMemo(
    () => profile.profileFiles.find((file) => file.kind === 'RESUME'),
    [profile.profileFiles]
  );

  const avatarValues = useMemo<IProfileAvatarValues>(
    () => ({
      avatar: profile.profileFiles.find((file) => file.kind === 'AVATAR') ?? null
    }),
    [profile.profileFiles]
  );

  const avatarMethods = useForm<IProfileAvatarValues>({
    values: avatarValues
  });

  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='p-6 text-center'>
          <div className='mb-5'>
            <FormProvider {...avatarMethods}>
              <Field.Upload<IProfileAvatarValues>
                name='avatar'
                label='Profile photo'
                variant='avatar'
                imageSrc={avatarUrl}
                initials={initials}
                buttonLabel={avatarValues.avatar ? 'Replace photo' : 'Upload photo'}
                accept='image/jpeg,image/png,image/webp'
                maxBytes={2 * 1024 * 1024}
                onUpload={onUploadAvatar}
              />
            </FormProvider>
          </div>

          <h2 className='text-lg font-bold'>
            {profile.firstName} {profile.lastName}
          </h2>

          {profile.headline && (
            <p className='mt-1 text-sm text-muted-foreground'>{profile.headline}</p>
          )}

          <div className='mt-3 space-y-1.5 text-left text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <Mail aria-hidden='true' className='size-4 shrink-0' />
              <span className='break-all'>{profile.email}</span>
            </div>

            {profile.location && (
              <div className='flex items-center gap-2'>
                <MapPin aria-hidden='true' className='size-4 shrink-0' />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.phone && (
              <div className='flex items-center gap-2'>
                <Phone aria-hidden='true' className='size-4 shrink-0' />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>

          <Button
            type='button'
            className='mt-4 w-full'
            size='sm'
            variant='outline'
            onClick={onEdit}
          >
            <Edit aria-hidden='true' className='size-4' />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-5'>
          <h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
            Skills
          </h3>

          {profile.skills.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {profile.skills.map((skill) => (
                <Badge key={skill} variant='secondary' className='bg-primary/10 text-foreground'>
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No skills added yet.</p>
          )}
        </CardContent>
      </Card>

      {resume && (
        <Card>
          <CardContent className='p-5'>
            <p className='mb-2 break-words text-sm text-muted-foreground'>{resume.filename}</p>

            <Button
              type='button'
              variant='link'
              className='h-auto p-0'
              disabled={isDownloadingResume}
              onClick={onDownloadResume}
            >
              {isDownloadingResume ? (
                <LoaderCircle aria-hidden='true' className='size-4 animate-spin' />
              ) : (
                <FileText aria-hidden='true' className='size-4' />
              )}
              {isDownloadingResume ? 'Preparing download…' : 'Download Resume'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
