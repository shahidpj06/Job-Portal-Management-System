import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout } from "./layouts/public-layout";
import { AdminLayout } from "./layouts/admin-layout";
import { HomePage } from "@/views/home/home-page";
import { JobsListPage } from "@/views/jobs/jobs-list-page";
import { JobDetailPage } from "@/views/jobs/job-detail-page";
import { LoginPage } from "@/views/auth/login-page";
import { SignupPage } from "@/views/auth/signup-page";
import { ForgotPasswordPage } from "@/views/auth/forgot-password-page";
import { ProfilePage } from "@/views/profile/profile-page";
import { ApplicationsPage } from "@/views/candidate/applications-page";
import { AdminDashboardPage } from "@/views/admin/admin-dashboard-page";
import { AdminJobsPage } from "@/views/admin/admin-jobs-page";
import { AdminJobFormPage } from "@/views/admin/admin-job-form-page";
import { AdminProfilePage } from "@/views/admin/admin-profile-page";
import { NotFoundPage } from "@/views/not-found-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "jobs",
        element: <JobsListPage />,
      },
      {
        path: "jobs/:id",
        element: <JobDetailPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/resume",
        element: <ProfilePage />,
      },
      {
        path: "profile/security",
        element: <ProfilePage />,
      },
      {
        path: "applications",
        element: <ApplicationsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "jobs",
        element: <AdminJobsPage />,
      },
      {
        path: "jobs/new",
        element: <AdminJobFormPage />,
      },
      {
        path: "jobs/:id/edit",
        element: <AdminJobFormPage />,
      },
      {
        path: "profile",
        element: <AdminProfilePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
