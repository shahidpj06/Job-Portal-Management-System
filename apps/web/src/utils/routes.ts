export const routes = {
  admin: {
    companies: {
      root: 'admin/companies'
    },
    jobs: {
      byId: (jobId: string) => `admin/jobs/${jobId}`,
      root: 'admin/jobs'
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
  }
} as const;
