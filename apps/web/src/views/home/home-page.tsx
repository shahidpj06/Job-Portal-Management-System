import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard, HeroSearchConsole, CategoryCard } from "@/components/jobs";
import { CareerProgressVisual } from "@/components/home";
import {
  mockJobs,
  mockCategories,
  mockHeroMetrics,
  mockPopularSearches,
  mockWhyChoosePoints,
  mockCareerMilestones,
} from "@/mocks";
import { PATHS } from "@/utils/paths";
import { APP_CONFIG } from "@/utils/global-config";

// Select 6 published featured jobs (aligns with the reference screenshot)
const FEATURED_JOBS = mockJobs
  .filter((j) => j.status === "PUBLISHED")
  .slice(1, 7);

const METRIC_ICONS = {
  Briefcase,
  Users,
  TrendingUp,
};

export function HomePage() {
  return (
    <div className="flex flex-col gap-0 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-surface/40 to-background px-4 pt-14 pb-16 sm:pt-20 sm:pb-24 text-center md:pt-24 md:pb-28">
        <div className="relative mx-auto max-w-4xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary mb-6 shadow-2xs">
            <span>🚀 Over 10,000 jobs updated daily</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Find Your Next <span className="text-primary">Dream Job</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base text-muted-foreground sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Browse thousands of opportunities from top companies. {APP_CONFIG.name} connects talented
            professionals with their ideal roles.
          </p>

          {/* Multi-Field Search Console */}
          <div className="mt-8 sm:mt-10">
            <HeroSearchConsole />
          </div>

          {/* Popular Search Keywords */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">Popular:</span>
            {mockPopularSearches.map((term) => (
              <Link
                key={term}
                to={`${PATHS.JOBS}?q=${encodeURIComponent(term)}`}
                className="rounded-md px-1.5 py-0.5 transition-colors hover:text-primary underline underline-offset-4 decoration-border hover:decoration-primary"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. METRICS / TRUST SECTION */}
      <section className="border-y border-border/80 bg-surface px-4 py-12 md:py-16">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {mockHeroMetrics.map((metric) => {
            const Icon = METRIC_ICONS[metric.iconName] || Briefcase;
            return (
              <div
                key={metric.label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xs mb-1">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold sm:text-4xl text-foreground tracking-tight">
                  {metric.value}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. BROWSE BY CATEGORY SECTION */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Browse by Category
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Find opportunities in your field
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-xl self-start sm:self-auto border-border hover:bg-muted font-semibold"
            >
              <Link to={PATHS.JOBS}>View all</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {mockCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED JOBS SECTION */}
      <section className="border-t border-border/80 bg-muted/30 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Featured Jobs
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Hand-picked opportunities for you
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-xl self-start sm:self-auto border-border hover:bg-muted font-semibold"
            >
              <Link to={PATHS.JOBS}>
                <span>Browse all jobs</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_JOBS.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              size="lg"
              asChild
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-sm"
            >
              <Link to={PATHS.JOBS}>
                <span>View All Jobs</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. WHY JOBNEST VALUE SECTION & CAREER PROGRESS */}
      <section className="border-t border-border/80 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Why Choose {APP_CONFIG.name}?
                </h2>
                <p className="mt-3 text-base text-muted-foreground sm:text-lg leading-relaxed">
                  We make the job search smarter, faster, and more rewarding for candidates and employers alike.
                </p>
              </div>

              <ul className="space-y-3.5">
                {mockWhyChoosePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm sm:text-base">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-tertiary mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-foreground">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Button
                  size="lg"
                  asChild
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 shadow-sm"
                >
                  <Link to={PATHS.SIGNUP}>Get Started Free</Link>
                </Button>
              </div>
            </div>

            {/* Career Progress Visual */}
            <div>
              <CareerProgressVisual milestones={mockCareerMilestones} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION (CTA) BANNER */}
      <section className="bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 px-4 py-16 md:py-20 text-center text-primary-foreground">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Ready to land your next role?
          </h2>
          <p className="text-base sm:text-lg text-indigo-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of professionals who found their dream jobs through {APP_CONFIG.name}.
          </p>
          <div className="pt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto rounded-xl bg-surface text-primary hover:bg-surface/90 font-bold px-7 shadow-md"
            >
              <Link to={PATHS.SIGNUP}>Create Free Account</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto rounded-xl border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 backdrop-blur-sm"
            >
              <Link to={PATHS.JOBS}>Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
