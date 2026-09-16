import { useNavigate } from 'react-router-dom';

import {
  mockCareerMilestones,
  mockCategories,
  mockHeroMetrics,
  mockPopularSearches,
  mockWhyChoosePoints
} from '@/mocks';
import { useAuthSession } from '@/services/auth';
import { useListPublicJobsQuery } from '@/services/job';
import { APP_CONFIG } from '@/utils/global-config';
import { paths } from '@/utils/paths';

import { CategoriesSection } from './components/category-section';
import { CtaBanner } from './components/cta-banner';
import { HeroSection } from './components/hero-section';
import { RecentJobsSection } from './components/recent-jobs-section';
import { StatsSection } from './components/stats-section';
import { WhyChooseSection } from './components/why-choose-section';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthSession();
  const { data: jobsResponse, isLoading, isError } = useListPublicJobsQuery({ page: 1, limit: 6 });

  const recentJobs = jobsResponse?.data.items ?? [];

  const handleApply = (jobId: string) => {
    navigate(paths['job-details'](jobId));
  };

  return (
    <div className='flex flex-col gap-0 overflow-hidden'>
      <HeroSection
        eyebrow='Over 10,000 jobs updated daily'
        title='Find work that moves your career forward'
        subtitle={`Browse thousands of opportunities from top companies. ${APP_CONFIG.name} connects talented professionals with their ideal roles.`}
        popularSearches={mockPopularSearches}
      />

      <StatsSection metrics={mockHeroMetrics} />

      <CategoriesSection categories={mockCategories} />

      <RecentJobsSection
        jobs={recentJobs}
        isLoading={isLoading}
        isError={isError}
        onApply={handleApply}
      />

      <WhyChooseSection
        appName={APP_CONFIG.name}
        isAuthenticated={isAuthenticated}
        milestones={mockCareerMilestones}
        points={mockWhyChoosePoints}
      />

      <CtaBanner
        title='Ready to land your next role?'
        description={`Join thousands of professionals who found their dream jobs through ${APP_CONFIG.name}.`}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};