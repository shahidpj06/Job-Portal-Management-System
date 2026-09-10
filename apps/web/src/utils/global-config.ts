const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not defined.');
}

export const APP_CONFIG = {
  name: 'JobNest',
  description:
    'Find your dream job or hire top talent with JobNest — the modern job board platform.',
  pagination: {
    defaultPageSize: 6,
    adminPageSize: 10
  },
  resume: {
    supportedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    maxSizeMB: 5
  },
  features: {
    enableDarkMode: false,
    enableNotifications: true
  },
  apiBaseUrl
} as const;
