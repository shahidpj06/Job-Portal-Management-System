import { AdminDashboardPage } from '@/views/admin/dashboard/dashboard-page';
import { AdminJobEditorPage } from '@/views/admin/job-editor/job-editor-page';
import { AdminJobsPage } from '@/views/admin/jobs/jobs';
import { AdminLayout } from './layouts/admin-layout';
import { AdminApplicationsPage } from '@/views/admin/applications/applications-page';
import { AdminProfilePage } from '@/views/admin/profile/admin-profile-page';
import { ApplicationsPage } from '@/views/applications/applications-page';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ForgotPasswordPage } from '@/views/auth/forgot-password-page';
import { ResetPasswordPage } from '@/views/auth/reset-password-page';
import { HomePage } from '@/views/home/home-page';
import { JobDetailPage } from '@/views/job-details/job-detail-page';
import { JobsPage } from '@/views/jobs/jobs';
import { LoginPage } from '@/views/auth/login-page';
import { NotFoundPage } from '@/views/not-found-page';
import { ProfilePage } from '@/views/profile/profile-page';
import { PublicLayout } from './layouts/public-layout';
import { GuestGuard } from './guards/guest-guard';
import { RouteGuard } from './guards/route-guard';
import { SignupPage } from '@/views/auth/signup-page';
import { AdminCompaniesPage } from '@/views/admin/companies/companies-page';
import { AdminUsersPage } from '@/views/admin/users/users-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'jobs',
        element: <JobsPage />
      },
      {
        path: 'jobs/:id',
        element: <JobDetailPage />
      },
      {
        path: 'login',
        element: <GuestGuard><LoginPage /></GuestGuard>
      },
      {
        path: 'signup',
        element: <GuestGuard><SignupPage /></GuestGuard>
      },
      {
        path: 'forgot-password',
        element: <GuestGuard><ForgotPasswordPage /></GuestGuard>
      },
      {
        path: 'reset-password',
        element: <GuestGuard><ResetPasswordPage /></GuestGuard>
      },
      {
        path: 'profile',
        element: (
          <RouteGuard allowedRoles={['USER']}>
            <ProfilePage />
          </RouteGuard>
        )
      },
      {
        path: 'profile/resume',
        element: (
          <RouteGuard allowedRoles={['USER']}>
            <ProfilePage />
          </RouteGuard>
        )
      },
      {
        path: 'profile/security',
        element: (
          <RouteGuard allowedRoles={['USER']}>
            <ProfilePage />
          </RouteGuard>
        )
      },
      {
        path: 'applications',
        element: (
          <RouteGuard allowedRoles={['USER']}>
            <ApplicationsPage />
          </RouteGuard>
        )
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to='/admin/dashboard' replace />
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />
      },
      {
        path: 'jobs',
        element: <AdminJobsPage />
      },
      {
        path: 'applications',
        element: <AdminApplicationsPage />
      },
      {
        path: 'companies',
        element: <AdminCompaniesPage />
      },
      {
        path: 'users',
        element: <AdminUsersPage />
      },
      {
        path: 'jobs/new',
        element: <AdminJobEditorPage />
      },
      {
        path: 'jobs/:id/edit',
        element: <AdminJobEditorPage />
      },
      {
        path: 'profile',
        element: <AdminProfilePage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
