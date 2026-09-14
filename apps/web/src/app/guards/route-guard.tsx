import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthSession } from '@/services/auth';
import type { AuthUserRole } from '@/types';
import { paths } from '@/utils/paths';

interface RouteGuardProps extends PropsWithChildren {
  allowedRoles?: AuthUserRole[];
  fallbackPath?: string;
}

export const RouteGuard = ({
  allowedRoles,
  children,
  fallbackPath = paths.jobs
}: RouteGuardProps) => {
  const { isAuthenticated, status, user } = useAuthSession();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground'>
        Loading your session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};
