import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common";
import {
  JobsSearchBanner,
  JobsFilterSidebar,
  JobsActiveFiltersBar,
  JobsFeedCard,
  JobsMobileDrawer,
  JobsAlertBanner,
} from "@/components/jobs";
import { mockJobs } from "@/mocks";
import type { Job } from "@/types";

const JOBS_PER_PAGE = 6;

export function JobsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const query = searchParams.get("q") || "";
  const locationParam = searchParams.get("location") || "";
  const categoryParam = searchParams.get("category") || "all";
  const workModeParam = searchParams.get("workMode") || "all";
  const employmentParamRaw = searchParams.get("employmentType") || "";
  const seniorityParamRaw = searchParams.get("seniority") || "";
  const minSalaryParam = Number(searchParams.get("minSalary")) || 50;
  const datePostedParam = searchParams.get("datePosted") || "all";
  const sortParam = searchParams.get("sort") || "relevant";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Local state
  const [savedJobs, setSavedJobs] = useState<Set<string>>(() => new Set(["job_1"]));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const employmentList = employmentParamRaw ? employmentParamRaw.split(",") : [];
  const seniorityList = seniorityParamRaw ? seniorityParamRaw.split(",") : [];

  // Update query params helper
  function updateParams(updates: Record<string, string | null>) {
    const nextParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || value === "all") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    }
    if (!("page" in updates)) {
      nextParams.delete("page");
    }
    setSearchParams(nextParams);
  }

  function handleSearch(keyword: string, location: string) {
    updateParams({
      q: keyword || null,
      location: location || null,
    });
  }

  function handleResetAll() {
    setSearchParams(new URLSearchParams());
  }

  function toggleEmploymentType(type: string) {
    const current = new Set(employmentList);
    if (current.has(type)) {
      current.delete(type);
    } else {
      current.add(type);
    }
    const arr = Array.from(current);
    updateParams({
      employmentType: arr.length > 0 ? arr.join(",") : null,
    });
  }

  function toggleSeniority(level: string) {
    const current = new Set(seniorityList);
    if (current.has(level)) {
      current.delete(level);
    } else {
      current.add(level);
    }
    const arr = Array.from(current);
    updateParams({
      seniority: arr.length > 0 ? arr.join(",") : null,
    });
  }

  function toggleSaveJob(jobId: string, title: string) {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        toast.info(`Removed "${title}" from saved jobs`);
      } else {
        next.add(jobId);
        toast.success(`Saved "${title}" to your bookmarks`);
      }
      return next;
    });
  }

  // Active filters count
  let activeFiltersCount = 0;
  if (query) activeFiltersCount++;
  if (locationParam) activeFiltersCount++;
  if (categoryParam !== "all") activeFiltersCount++;
  if (workModeParam !== "all") activeFiltersCount++;
  if (employmentList.length > 0) activeFiltersCount += employmentList.length;
  if (seniorityList.length > 0) activeFiltersCount += seniorityList.length;
  if (minSalaryParam > 50) activeFiltersCount++;
  if (datePostedParam !== "all") activeFiltersCount++;

  // Filter jobs based on all criteria
  const filteredJobs = mockJobs.filter((job) => {
    if (job.status !== "PUBLISHED") return false;

    if (query) {
      const qLower = query.toLowerCase();
      const matches =
        job.title.toLowerCase().includes(qLower) ||
        job.company.name.toLowerCase().includes(qLower) ||
        job.overview.toLowerCase().includes(qLower) ||
        job.skills.some((s) => s.toLowerCase().includes(qLower));
      if (!matches) return false;
    }

    if (locationParam) {
      const locLower = locationParam.toLowerCase();
      if (locLower === "remote") {
        if (job.workMode !== "REMOTE" && !job.location.toLowerCase().includes("remote")) {
          return false;
        }
      } else if (!job.location.toLowerCase().includes(locLower)) {
        return false;
      }
    }

    if (categoryParam !== "all" && job.categoryId !== categoryParam) return false;
    if (workModeParam !== "all" && job.workMode !== workModeParam) return false;
    if (employmentList.length > 0 && !employmentList.includes(job.employmentType)) return false;
    if (seniorityList.length > 0 && !seniorityList.includes(job.experienceLevel)) return false;

    if (minSalaryParam > 50 && job.salary.max < minSalaryParam * 1000) return false;

    if (datePostedParam !== "all") {
      const postDate = new Date(job.createdAt).getTime();
      const refTime = 1773000000000;
      const diffHours = Math.max(0, (refTime - postDate) / (1000 * 60 * 60));
      if (datePostedParam === "24h" && diffHours > 24) return false;
      if (datePostedParam === "7d" && diffHours > 24 * 7) return false;
      if (datePostedParam === "30d" && diffHours > 24 * 30) return false;
    }

    return true;
  });

  // Sort
  const sortedJobs = [...filteredJobs];
  if (sortParam === "newest") {
    sortedJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortParam === "highest_salary") {
    sortedJobs.sort((a, b) => b.salary.max - a.salary.max);
  }

  // Pagination
  const totalJobs = sortedJobs.length;
  const pageCount = Math.max(1, Math.ceil(totalJobs / JOBS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), pageCount);
  const startIdx = (safePage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = sortedJobs.slice(startIdx, startIdx + JOBS_PER_PAGE);

  // Counts
  const publishedJobs = mockJobs.filter((j) => j.status === "PUBLISHED");
  const categoryCounts: Record<string, number> = {};
  const workModeCounts: Record<string, number> = {};
  const employmentCounts: Record<string, number> = {};

  for (const job of publishedJobs) {
    categoryCounts[job.categoryId] = (categoryCounts[job.categoryId] || 0) + 1;
    workModeCounts[job.workMode] = (workModeCounts[job.workMode] || 0) + 1;
    employmentCounts[job.employmentType] = (employmentCounts[job.employmentType] || 0) + 1;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 1. Hero Search Console Banner */}
      <JobsSearchBanner
        initialQuery={query}
        initialLocation={locationParam}
        onSearch={handleSearch}
      />

      {/* 2. Main Discovery Arena */}
      <section className="w-full py-8 md:py-12">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          {/* Subheader Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Showing {totalJobs} open {totalJobs === 1 ? "job" : "jobs"}
              </h2>
              <span className="text-xs sm:text-sm text-muted-foreground">
                updated recently
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Button (visible on small viewports) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden rounded-xl gap-2 font-medium"
              >
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {/* Sort Control */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-select"
                  className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap"
                >
                  Sort by:
                </label>
                <Select
                  value={sortParam}
                  onValueChange={(val) => updateParams({ sort: val })}
                >
                  <SelectTrigger
                    id="sort-select"
                    className="h-9 w-[150px] sm:w-[170px] rounded-xl text-xs sm:text-sm bg-surface"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="relevant">Most Relevant</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="highest_salary">Highest Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 3. Responsive Layout: Dedicated Desktop Sidebar + Main Feed */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Desktop Filter Sidebar: Always visible on tablet & desktop (>= 768px) */}
            <div className="hidden md:block w-72 lg:w-80 shrink-0 sticky top-20">
              <JobsFilterSidebar
                categoryParam={categoryParam}
                workModeParam={workModeParam}
                employmentList={employmentList}
                seniorityList={seniorityList}
                minSalaryParam={minSalaryParam}
                datePostedParam={datePostedParam}
                activeFiltersCount={activeFiltersCount}
                totalPublishedCount={publishedJobs.length}
                categoryCounts={categoryCounts}
                workModeCounts={workModeCounts}
                employmentCounts={employmentCounts}
                onCategoryChange={(cat) => updateParams({ category: cat })}
                onWorkModeChange={(mode) => updateParams({ workMode: mode })}
                onToggleEmployment={toggleEmploymentType}
                onToggleSeniority={toggleSeniority}
                onMinSalaryChange={(val) => updateParams({ minSalary: val })}
                onDatePostedChange={(d) => updateParams({ datePosted: d })}
                onResetAll={handleResetAll}
              />
            </div>

            {/* Right Main Listings Area */}
            <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
              {/* Dedicated Active Filters Bar (Always visible above the feed) */}
              <JobsActiveFiltersBar
                query={query}
                locationParam={locationParam}
                categoryParam={categoryParam}
                workModeParam={workModeParam}
                employmentList={employmentList}
                seniorityList={seniorityList}
                minSalaryParam={minSalaryParam}
                activeFiltersCount={activeFiltersCount}
                onClearQuery={() => updateParams({ q: null })}
                onClearLocation={() => updateParams({ location: null })}
                onClearCategory={() => updateParams({ category: null })}
                onClearWorkMode={() => updateParams({ workMode: null })}
                onToggleEmployment={toggleEmploymentType}
                onToggleSeniority={toggleSeniority}
                onClearMinSalary={() => updateParams({ minSalary: null })}
                onClearAll={handleResetAll}
              />

              {/* Job Listings Feed */}
              {paginatedJobs.length === 0 ? (
                <div className="rounded-2xl border border-border/80 bg-surface p-8 shadow-sm">
                  <EmptyState
                    title="No jobs found matching your criteria"
                    description="Try adjusting your keywords, widening your location, or resetting filters."
                    action={
                      <Button onClick={handleResetAll} variant="outline" className="rounded-xl">
                        Reset Filters
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedJobs.map((job: Job, index: number) => (
                    <JobsFeedCard
                      key={job.id}
                      job={job}
                      isFeatured={index === 0 && safePage === 1}
                      isSaved={savedJobs.has(job.id)}
                      onToggleSave={toggleSaveJob}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {pageCount > 1 && (
                <div className="rounded-2xl border border-border/80 bg-surface p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Page <strong className="font-bold text-foreground">{safePage}</strong> of{" "}
                    <strong className="font-bold text-foreground">{pageCount}</strong> ({totalJobs} roles)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-9 w-9"
                      disabled={safePage === 1}
                      onClick={() => updateParams({ page: String(safePage - 1) })}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={pageNum === safePage ? "default" : "outline"}
                        size="icon"
                        className="rounded-xl h-9 w-9 text-xs font-semibold"
                        onClick={() => updateParams({ page: String(pageNum) })}
                      >
                        {pageNum}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-9 w-9"
                      disabled={safePage === pageCount}
                      onClick={() => updateParams({ page: String(safePage + 1) })}
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Talent Alert Banner */}
          <JobsAlertBanner />
        </div>
      </section>

      {/* 5. Mobile Filter Bottom Sheet Drawer */}
      <JobsMobileDrawer
        open={mobileDrawerOpen}
        onOpenChange={setMobileDrawerOpen}
        categoryParam={categoryParam}
        workModeParam={workModeParam}
        employmentList={employmentList}
        seniorityList={seniorityList}
        minSalaryParam={minSalaryParam}
        activeFiltersCount={activeFiltersCount}
        totalJobs={totalJobs}
        onCategoryChange={(cat) => updateParams({ category: cat })}
        onWorkModeChange={(mode) => updateParams({ workMode: mode })}
        onToggleEmployment={toggleEmploymentType}
        onToggleSeniority={toggleSeniority}
        onMinSalaryChange={(val) => updateParams({ minSalary: val })}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
