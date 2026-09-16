import { useNavigate } from 'react-router-dom';

import {
  careerMilestonesData,
  categoriesData,
  heroMetricsData,
  popularSearchesData,
  benfitPointsData
} from '@/mocks';
import { useAuthSession } from '@/services/auth';
import { useListPublicJobsQuery } from '@/services/job';
import { APP_CONFIG } from '@/utils/global-config';
import { paths } from '@/utils/paths';

import { CategoriesSection } from './components/category-section';
import { CtaBanner } from './components/cta-banner';
import { HeroSection } from './components/hero-section';
import { PlatformBenefitsSection } from './components/platform-benefits-section';
import { RecentJobsSection } from './components/recent-jobs-section';
import { StatsSection } from './components/stats-section';

const RECENT_JOBS_LIMIT = 6;

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthSession();

  const {
    data: publicJobsResponse,
    isError,
    isLoading
  } = useListPublicJobsQuery({
    limit: RECENT_JOBS_LIMIT,
    page: 1
  });

  const recentJobs = publicJobsResponse?.data.items ?? [];

  const handleJobApply = (jobId: string) => {
    navigate(paths['job-details'](jobId));
  };

  return (
    <div className='flex flex-col overflow-hidden'>
      <HeroSection
        eyebrow='Over 10,000 jobs updated daily'
        popularSearches={popularSearchesData}
        subtitle={`Browse thousands of opportunities from top companies. ${APP_CONFIG.name} connects talented professionals with their ideal roles.`}
        title='Find work that moves your career forward'
      />

      <StatsSection metrics={heroMetricsData} />

      <CategoriesSection categories={categoriesData} />

      <RecentJobsSection
        isError={isError}
        isLoading={isLoading}
        jobs={recentJobs}
        onApply={handleJobApply}
      />

      <PlatformBenefitsSection
        appName={APP_CONFIG.name}
        isAuthenticated={isAuthenticated}
        milestones={careerMilestonesData}
        benefits={benfitPointsData}
      />

      <CtaBanner
        description={`Join thousands of professionals who found their dream jobs through ${APP_CONFIG.name}.`}
        isAuthenticated={isAuthenticated}
        title='Ready to land your next role?'
      />
    </div>
  );
};
