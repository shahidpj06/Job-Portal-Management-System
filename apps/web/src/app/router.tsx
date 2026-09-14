import { AdminDashboardPage } from '@/views/admin/admin-dashboard-page';
import { AdminJobFormPage } from '@/views/admin/admin-job-form-page';
import { AdminJobsView } from '@/views/admin/jobs/jobs';
import { AdminLayout } from './layouts/admin-layout';
import { AdminProfilePage } from '@/views/admin/admin-profile-page';
import { ApplicationsPage } from '@/views/candidate/applications-page';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ForgotPasswordPage } from '@/views/auth/forgot-password-page';
import { HomePage } from '@/views/home/home-page';
import { JobDetailPage } from '@/views/jobs/job-detail-page';
import { JobsListPage } from '@/views/jobs/jobs-list-page';
import { LoginPage } from '@/views/auth/login-page';
import { NotFoundPage } from '@/views/not-found-page';
import { ProfilePage } from '@/views/profile/profile-page';
import { PublicLayout } from './layouts/public-layout';
import { RouteGuard } from './guards/route-guard';
import { SignupPage } from '@/views/auth/signup-page';

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
        element: <JobsListPage />
      },
      {
        path: 'jobs/:id',
        element: <JobDetailPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'signup',
        element: <SignupPage />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />
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
        element: <AdminJobsView />
      },
      {
        path: 'jobs/new',
        element: <AdminJobFormPage />
      },
      {
        path: 'jobs/:id/edit',
        element: <AdminJobFormPage />
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
