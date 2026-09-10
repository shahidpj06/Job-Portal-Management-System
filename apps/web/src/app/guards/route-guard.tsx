import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthSession } from '@/services/auth';
import type { AuthUserRole } from '@/types';
import { PATHS } from '@/utils/paths';

interface RouteGuardProps extends PropsWithChildren {
  allowedRoles?: AuthUserRole[];
  fallbackPath?: string;
}

export const RouteGuard = ({
  allowedRoles,
  children,
  fallbackPath = PATHS.JOBS
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
    return <Navigate to={PATHS.LOGIN} replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};
