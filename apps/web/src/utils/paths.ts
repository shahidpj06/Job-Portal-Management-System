export const PATHS = {
  HOME: "/",
  JOBS: "/jobs",
  JOB_DETAILS: (id: string) => `/jobs/${id}`,
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PROFILE: "/profile",
  PROFILE_RESUME: "/profile/resume",
  PROFILE_SECURITY: "/profile/security",
  APPLICATIONS: "/applications",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    JOBS: "/admin/jobs",
    NEW_JOB: "/admin/jobs/new",
    EDIT_JOB: (id: string) => `/admin/jobs/${id}/edit`,
    PROFILE: "/admin/profile",
  }
};
