import { X } from "lucide-react";
import { mockCategories } from "@/mocks";
import type { EmploymentType, ExperienceLevel, WorkMode } from "@/types";
import { formatEmploymentType, formatExperience, formatWorkMode } from "@/utils/formatters";

interface JobsActiveFiltersBarProps {
  query: string;
  locationParam: string;
  categoryParam: string;
  workModeParam: string;
  employmentList: string[];
  seniorityList: string[];
  minSalaryParam: number;
  activeFiltersCount: number;
  onClearQuery: () => void;
  onClearLocation: () => void;
  onClearCategory: () => void;
  onClearWorkMode: () => void;
  onToggleEmployment: (type: string) => void;
  onToggleSeniority: (level: string) => void;
  onClearMinSalary: () => void;
  onClearAll: () => void;
}

export function JobsActiveFiltersBar({
  query,
  locationParam,
  categoryParam,
  workModeParam,
  employmentList,
  seniorityList,
  minSalaryParam,
  activeFiltersCount,
  onClearQuery,
  onClearLocation,
  onClearCategory,
  onClearWorkMode,
  onToggleEmployment,
  onToggleSeniority,
  onClearMinSalary,
  onClearAll,
}: JobsActiveFiltersBarProps) {
  const categoryName =
    categoryParam !== "all"
      ? mockCategories.find((c) => c.id === categoryParam)?.name || categoryParam
      : "";

  return (
    <div className="rounded-xl border border-border/70 bg-surface p-3 shadow-2xs flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
        Active filters:
      </span>

      {activeFiltersCount === 0 ? (
        <span className="text-xs text-muted-foreground italic">
          All positions (Use the sidebar to filter by department, mode, or salary)
        </span>
      ) : (
        <>
          {query && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium">
              <span>"{query}"</span>
              <button
                type="button"
                onClick={onClearQuery}
                className="hover:text-destructive transition-colors"
                aria-label="Remove keyword filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {locationParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium">
              <span>{locationParam}</span>
              <button
                type="button"
                onClick={onClearLocation}
                className="hover:text-destructive transition-colors"
                aria-label="Remove location filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {categoryName && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium">
              <span>{categoryName}</span>
              <button
                type="button"
                onClick={onClearCategory}
                className="hover:text-destructive transition-colors"
                aria-label="Remove category filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {workModeParam !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium">
              <span>{formatWorkMode(workModeParam as WorkMode)}</span>
              <button
                type="button"
                onClick={onClearWorkMode}
                className="hover:text-destructive transition-colors"
                aria-label="Remove workplace filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {employmentList.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium"
            >
              <span>{formatEmploymentType(type as EmploymentType)}</span>
              <button
                type="button"
                onClick={() => onToggleEmployment(type)}
                className="hover:text-destructive transition-colors"
                aria-label={`Remove ${type} filter`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}

          {seniorityList.map((level) => (
            <span
              key={level}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium"
            >
              <span>{formatExperience(level as ExperienceLevel)}</span>
              <button
                type="button"
                onClick={() => onToggleSeniority(level)}
                className="hover:text-destructive transition-colors"
                aria-label={`Remove ${level} filter`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}

          {minSalaryParam > 50 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium">
              <span>Salary &gt;= ${minSalaryParam}k</span>
              <button
                type="button"
                onClick={onClearMinSalary}
                className="hover:text-destructive transition-colors"
                aria-label="Remove salary filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-primary hover:underline ml-auto"
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
}
