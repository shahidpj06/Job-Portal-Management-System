import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthSession } from '@/services/auth';
import { paths } from '@/utils/paths';

/**
 * Prevents authenticated users from accessing guest-only pages
 * (e.g., login, sign-up, forgot password, reset password).
 * Redirects to the home page if the user is already signed in.
 */
export const GuestGuard = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, status } = useAuthSession();

  if (status === 'checking') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground'>
        Loading your session…
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={paths.home} replace />;
  }

  return children;
};
