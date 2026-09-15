export const paths = {
  home: '/',
  jobs: '/jobs',
  'job-details': (id: string) => `/jobs/${id}`,
  auth: {
    login: '/login',
    'sign-up': '/signup',
    'forgot-password': '/forgot-password',
    'reset-password': '/reset-password'
  },
  profile: '/profile',
  'profile-resume': '/profile/resume',
  'profile-security': '/profile/security',
  applications: '/applications',
  admin: {
    applications: '/admin/applications',
    companies: '/admin/companies',
    dashboard: '/admin/dashboard',
    jobs: '/admin/jobs',
    'new-job': '/admin/jobs/new',
    'edit-job': (id: string) => `/admin/jobs/${id}/edit`,
    profile: '/admin/profile'
  }
};
