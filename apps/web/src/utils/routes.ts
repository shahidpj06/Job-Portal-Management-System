export const routes = {
  admin: {
    companies: {
      root: 'admin/companies',
      byId: (companyId: string) => `admin/companies/${encodeURIComponent(companyId)}`
    },
    jobs: {
      root: 'admin/jobs',
      byId: (jobId: string) => `admin/jobs/${jobId}`
    },
    applications: {
      root: 'admin/applications',
      byId: (applicationId: string) => `admin/applications/${encodeURIComponent(applicationId)}`
    },
    dashboard: {
      summary: 'admin/dashboard/summary'
    },
    users: {
      root: 'admin/users'
    }
  },
  auth: {
    register: 'auth/register',
    login: 'auth/login',
    refresh: 'auth/refresh',
    logout: 'auth/logout',
    me: 'auth/me',
    changePassword: 'auth/change-password',
    forgotPassword: 'auth/forgot-password',
    resetPassword: 'auth/reset-password'
  },
  jobs: {
    root: 'jobs',
    byId: (jobId: string) => `jobs/${encodeURIComponent(jobId)}`
  },
  profile: {
    root: 'profile',
    avatar: 'profile/avatar',
    resume: 'profile/resume'
  },
  applications: {
    root: 'applications'
  }
} as const;
