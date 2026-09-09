import { SlidersHorizontal, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockCategories } from "@/mocks";
import type { EmploymentType, WorkMode, ExperienceLevel } from "@/types";

interface JobsFilterSidebarProps {
  categoryParam: string;
  workModeParam: string;
  employmentList: string[];
  seniorityList: string[];
  minSalaryParam: number;
  datePostedParam: string;
  activeFiltersCount: number;
  totalPublishedCount: number;
  categoryCounts: Record<string, number>;
  workModeCounts: Record<string, number>;
  employmentCounts: Record<string, number>;
  onCategoryChange: (category: string) => void;
  onWorkModeChange: (mode: string) => void;
  onToggleEmployment: (type: string) => void;
  onToggleSeniority: (level: string) => void;
  onMinSalaryChange: (val: string) => void;
  onDatePostedChange: (date: string) => void;
  onResetAll: () => void;
}

const EMPLOYMENT_OPTIONS: { id: EmploymentType; label: string }[] = [
  { id: "FULL_TIME", label: "Full-time" },
  { id: "CONTRACT", label: "Contract" },
  { id: "PART_TIME", label: "Part-time" },
  { id: "INTERNSHIP", label: "Internship" },
];

const WORK_MODE_OPTIONS: { id: WorkMode | "all"; label: string }[] = [
  { id: "all", label: "All Modes" },
  { id: "REMOTE", label: "Remote" },
  { id: "HYBRID", label: "Hybrid" },
  { id: "ON_SITE", label: "On-site" },
];

const SENIORITY_OPTIONS: { id: ExperienceLevel; label: string }[] = [
  { id: "ENTRY_LEVEL", label: "Entry Level" },
  { id: "MID_LEVEL", label: "Mid-Level" },
  { id: "SENIOR_LEVEL", label: "Senior Level" },
  { id: "DIRECTOR", label: "Lead / Staff" },
  { id: "EXECUTIVE", label: "Director / VP" },
];

const DATE_POSTED_OPTIONS = [
  { id: "all", label: "Any time" },
  { id: "24h", label: "Past 24 hours" },
  { id: "7d", label: "Past week" },
  { id: "30d", label: "Past month" },
];

export function JobsFilterSidebar({
  categoryParam,
  workModeParam,
  employmentList,
  seniorityList,
  minSalaryParam,
  datePostedParam,
  activeFiltersCount,
  totalPublishedCount,
  categoryCounts,
  workModeCounts,
  employmentCounts,
  onCategoryChange,
  onWorkModeChange,
  onToggleEmployment,
  onToggleSeniority,
  onMinSalaryChange,
  onDatePostedChange,
  onResetAll,
}: JobsFilterSidebarProps) {
  return (
    <aside className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="px-1.5 py-0.2 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onResetAll}
            className="text-xs font-semibold text-primary hover:underline transition-colors"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Department / Category */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
          Department
        </span>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`w-full flex items-center justify-between text-xs sm:text-sm py-1.5 px-2 rounded-lg transition-colors text-left ${
              categoryParam === "all"
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <span>All Departments</span>
            <span className="text-[11px] rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
              {totalPublishedCount}
            </span>
          </button>
          {mockCategories.map((cat) => {
            const isSelected = categoryParam === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(isSelected ? "all" : cat.id)}
                className={`w-full flex items-center justify-between text-xs sm:text-sm py-1.5 px-2 rounded-lg transition-colors text-left ${
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <span className="text-[11px] rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workplace Type (Work Mode) */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
          Workplace Type
        </span>
        <div className="space-y-2">
          {WORK_MODE_OPTIONS.map((opt) => {
            const isSelected = workModeParam === opt.id;
            const count =
              opt.id === "all" ? totalPublishedCount : workModeCounts[opt.id] || 0;
            return (
              <label
                key={opt.id}
                className="flex items-center justify-between cursor-pointer text-xs sm:text-sm text-muted-foreground hover:text-foreground group py-0.5"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="work_mode_sidebar"
                    checked={isSelected}
                    onChange={() => onWorkModeChange(opt.id)}
                    className="h-4 w-4 text-primary accent-primary cursor-pointer"
                  />
                  <span className={isSelected ? "font-semibold text-foreground" : ""}>
                    {opt.label}
                  </span>
                </span>
                <span className="text-[11px] rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Employment Type */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
          Employment Type
        </span>
        <div className="space-y-2">
          {EMPLOYMENT_OPTIONS.map((opt) => {
            const isChecked = employmentList.includes(opt.id);
            const count = employmentCounts[opt.id] || 0;
            return (
              <label
                key={opt.id}
                className="flex items-center justify-between cursor-pointer text-xs sm:text-sm text-muted-foreground hover:text-foreground group py-0.5"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleEmployment(opt.id)}
                    className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
                  />
                  <span className={isChecked ? "font-semibold text-foreground" : ""}>
                    {opt.label}
                  </span>
                </span>
                <span className="text-[11px] rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Seniority / Experience Level */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
          Seniority Level
        </span>
        <div className="space-y-2">
          {SENIORITY_OPTIONS.map((opt) => {
            const isChecked = seniorityList.includes(opt.id);
            return (
              <label
                key={opt.id}
                className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-muted-foreground hover:text-foreground py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleSeniority(opt.id)}
                  className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
                />
                <span className={isChecked ? "font-semibold text-foreground" : ""}>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Annual Target Salary Slider */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Min Base Salary
          </span>
          <span className="text-xs font-bold text-primary">
            ${minSalaryParam}k - $350k+
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="250"
          step="10"
          value={minSalaryParam}
          onChange={(e) => onMinSalaryChange(e.target.value)}
          className="w-full h-2 rounded-lg bg-muted accent-primary cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
          <span>$50k</span>
          <span>$150k</span>
          <span>$250k+</span>
        </div>
      </div>

      {/* Date Posted */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
          Date Posted
        </span>
        <div className="space-y-2">
          {DATE_POSTED_OPTIONS.map((opt) => {
            const isSelected = datePostedParam === opt.id;
            return (
              <label
                key={opt.id}
                className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-muted-foreground hover:text-foreground py-0.5"
              >
                <input
                  type="radio"
                  name="date_posted_sidebar"
                  checked={isSelected}
                  onChange={() => onDatePostedChange(opt.id)}
                  className="h-4 w-4 text-primary accent-primary cursor-pointer"
                />
                <span className={isSelected ? "font-semibold text-foreground" : ""}>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Career Insight Box */}
      <div className="p-4 rounded-xl bg-muted/60 border border-border/50 text-foreground space-y-1.5">
        <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
          <TrendingUp className="h-4 w-4" />
          <span>Salary Transparency</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          89% of roles on JobNest feature verified pay transparency ranges vetted by compensation advisors.
        </p>
      </div>
    </aside>
  );
}
