import { skipToken } from '@reduxjs/toolkit/query/react';
import { Briefcase } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getApiErrorMessage } from '@/services/api';
import { useAuthSession } from '@/services/auth';
import {
  useGetProfileFileAccessQuery,
  useGetProfileQuery,
  useLazyGetProfileFileAccessQuery,
  useUpdateProfileMutation,
  useUploadProfileFileMutation
} from '@/services/profile/profile.api';
import type { IUpdateProfileRequest, ProfileUploadKind } from '@/types';
import { formatDate } from '@/utils/formatters';
import { paths } from '@/utils/paths';

import { ProfileDetailsForm } from './components/profile-details-form';
import { ProfileFilesForm } from './components/profile-files-form';
import { ProfileSidebar } from './components/profile-sidebar';

export const ProfilePage = () => {
  const { user } = useAuthSession();
  const { pathname } = useLocation();
  const userId = user?.id;
  const profileFormRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState(pathname === paths.profile ? 'about' : 'settings');

  const { currentData, error, isFetching, isError, refetch } = useGetProfileQuery(
    userId ?? skipToken,
    {
      refetchOnMountOrArgChange: true
    }
  );

  const profile = currentData?.data.profile;

  const hasAvatar = useMemo(
    () => profile?.profileFiles.some((file) => file.kind === 'AVATAR') ?? false,
    [profile?.profileFiles]
  );

  const memberSince = useMemo(() => (profile ? formatDate(profile.createdAt) : ''), [profile]);

  const { currentData: avatarAccess } = useGetProfileFileAccessQuery(
    userId && hasAvatar ? { userId, kind: 'avatar' } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 4 * 60 * 1000
    }
  );

  const [updateProfile] = useUpdateProfileMutation();
  const [uploadProfileFile] = useUploadProfileFileMutation();
  const [getFileAccess, { isFetching: isDownloadingResume }] = useLazyGetProfileFileAccessQuery();

  const onTabChange = useCallback((value: unknown) => {
    if (value === 'about' || value === 'settings') {
      setActiveTab(value);
    }
  }, []);

  const onEdit = useCallback(() => {
    setActiveTab('settings');

    if (window.matchMedia('(min-width: 64rem)').matches) {
      return;
    }

    window.requestAnimationFrame(() => {
      const form = profileFormRef.current;

      if (!form) {
        return;
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      form.focus({ preventScroll: true });
      form.scrollIntoView({
        behavior: prefersReducedMotion ? 'instant' : 'smooth',
        block: 'start'
      });
    });
  }, []);

  const onRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const onSaveProfile = useCallback(
    async (data: IUpdateProfileRequest) => {
      if (!userId) {
        throw new Error('Sign in again to update your profile.');
      }

      try {
        const response = await updateProfile({ userId, data }).unwrap();

        toast.success('Profile updated successfully.');

        return response.data.profile;
      } catch (requestError) {
        throw new Error(getApiErrorMessage(requestError, 'Unable to update your profile.'));
      }
    },
    [updateProfile, userId]
  );

  const onUploadFile = useCallback(
    async (kind: ProfileUploadKind, file: File) => {
      if (!userId) {
        throw new Error('Sign in again to upload a file.');
      }

      try {
        const response = await uploadProfileFile({ userId, kind, file }).unwrap();

        toast.success(kind === 'avatar' ? 'Profile photo updated.' : 'Resume updated.');

        return response.data.file;
      } catch (requestError) {
        throw new Error(getApiErrorMessage(requestError, 'Unable to upload your file.'));
      }
    },
    [uploadProfileFile, userId]
  );

  const onUploadAvatar = useCallback((file: File) => onUploadFile('avatar', file), [onUploadFile]);
  const onUploadResume = useCallback((file: File) => onUploadFile('resume', file), [onUploadFile]);

  const onDownloadResume = useCallback(async () => {
    if (!userId || isDownloadingResume) {
      return;
    }

    try {
      const response = await getFileAccess({ userId, kind: 'resume' }, false).unwrap();

      window.location.assign(response.data.file.url);
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, 'Unable to download your resume.'));
    }
  }, [getFileAccess, isDownloadingResume, userId]);

  if (!userId) {
    return null;
  }

  if (!profile) {
    return (
      <div className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
        {isError ? (
          <ErrorState
            title='Unable to load your profile'
            description={getApiErrorMessage(error)}
            onRetry={onRetry}
          />
        ) : (
          <LoadingState />
        )}
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
      {isError && (
        <p role='alert' className='mb-4 text-sm text-destructive'>
          We couldn’t refresh your profile. Your last loaded information is shown.
        </p>
      )}

      {isFetching && (
        <p role='status' className='mb-4 text-sm text-muted-foreground'>
          Refreshing profile…
        </p>
      )}

      <div className='grid items-start gap-6 lg:grid-cols-3'>
        <ProfileSidebar
          key={`sidebar-${profile.id}`}
          profile={profile}
          avatarUrl={avatarAccess?.data.file.url}
          isDownloadingResume={isDownloadingResume}
          onEdit={onEdit}
          onDownloadResume={onDownloadResume}
          onUploadAvatar={onUploadAvatar}
        />

        <div className='min-w-0 lg:col-span-2'>
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className='mb-4'>
              <TabsTrigger value='about'>About</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
            </TabsList>

            <TabsContent value='about'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Briefcase aria-hidden='true' className='size-4' />
                    About Me
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className='whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground'>
                    {profile.bio || 'No bio added yet.'}
                  </p>

                  <div className='mt-4 border-t border-border pt-4 text-sm text-muted-foreground'>
                    Member since {memberSince}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='settings' keepMounted className='data-[hidden]:hidden'>
              <div className='space-y-6'>
                <div
                  ref={profileFormRef}
                  tabIndex={-1}
                  role='region'
                  aria-label='Edit profile details'
                  className='scroll-mt-24 rounded-xl focus-visible:outline-2 focus-visible:outline-ring'
                >
                  <ProfileDetailsForm
                    key={`details-${profile.id}`}
                    profile={profile}
                    onSave={onSaveProfile}
                  />
                </div>

                <ProfileFilesForm
                  key={`files-${profile.id}`}
                  files={profile.profileFiles}
                  onUploadResume={onUploadResume}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
