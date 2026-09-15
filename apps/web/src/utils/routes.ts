export const routes = {
  admin: {
    companies: {
      root: 'admin/companies'
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
    }
  },
  auth: {
    register: 'auth/register',
    login: 'auth/login',
    refresh: 'auth/refresh',
    logout: 'auth/logout',
    me: 'auth/me'
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
