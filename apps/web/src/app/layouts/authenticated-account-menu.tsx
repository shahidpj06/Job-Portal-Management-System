import { skipToken } from '@reduxjs/toolkit/query/react';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuthSession } from '@/services/auth';
import { useGetProfileFileAccessQuery, useGetProfileQuery } from '@/services/profile/profile.api';
import { paths } from '@/utils/paths';
import { AccountMenu } from '@/components/layout/account-menu';

const AVATAR_FILE_KIND = 'AVATAR';
const AVATAR_FILE_QUERY_KIND = 'avatar';
const AVATAR_REFRESH_INTERVAL_MILLISECONDS = 4 * 60 * 1_000;

export const AuthenticatedAccountMenu = () => {
  const { isAuthenticated, isLoading: isSigningOut, logout, status, user } = useAuthSession();
  const navigate = useNavigate();
  const userId = isAuthenticated ? user?.id : undefined;
  const { currentData: profileResponse } = useGetProfileQuery(userId ?? skipToken);

  const hasAvatar = useMemo(
    () =>
      profileResponse?.data.profile.profileFiles.some(
        (profileFile) => profileFile.kind === AVATAR_FILE_KIND
      ) ?? false,
    [profileResponse]
  );

  const { currentData: avatarResponse } = useGetProfileFileAccessQuery(
    userId && hasAvatar
      ? {
          kind: AVATAR_FILE_QUERY_KIND,
          userId
        }
      : skipToken,
    {
      pollingInterval: AVATAR_REFRESH_INTERVAL_MILLISECONDS,
      refetchOnMountOrArgChange: true
    }
  );

  const handleLogout = useCallback(async () => {
    if (isSigningOut) {
      return;
    }

    try {
      await logout();
    } catch {
      toast.error('Server sign-out failed. Your local session was cleared.');
    } finally {
      navigate(paths.home, {
        replace: true
      });
    }
  }, [isSigningOut, logout, navigate]);

  if (status === 'checking') {
    return <Skeleton className='size-10 rounded-full' />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <AccountMenu
      avatarUrl={avatarResponse?.data.file.url}
      isSigningOut={isSigningOut}
      onLogout={handleLogout}
      user={user}
    />
  );
};
