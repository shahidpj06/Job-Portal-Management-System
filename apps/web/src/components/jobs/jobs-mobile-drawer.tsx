import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { mockCategories } from "@/mocks";
import type { EmploymentType, WorkMode, ExperienceLevel } from "@/types";

interface JobsMobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryParam: string;
  workModeParam: string;
  employmentList: string[];
  seniorityList: string[];
  minSalaryParam: number;
  activeFiltersCount: number;
  totalJobs: number;
  onCategoryChange: (cat: string) => void;
  onWorkModeChange: (mode: string) => void;
  onToggleEmployment: (type: string) => void;
  onToggleSeniority: (level: string) => void;
  onMinSalaryChange: (val: string) => void;
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

export function JobsMobileDrawer({
  open,
  onOpenChange,
  categoryParam,
  workModeParam,
  employmentList,
  seniorityList,
  minSalaryParam,
  activeFiltersCount,
  totalJobs,
  onCategoryChange,
  onWorkModeChange,
  onToggleEmployment,
  onToggleSeniority,
  onMinSalaryChange,
  onResetAll,
}: JobsMobileDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-6"
      >
        <SheetHeader className="p-0 text-left border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg font-bold">Filter Roles</SheetTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="px-2 py-0.5 text-xs font-bold">
                  {activeFiltersCount} Active
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* Department in Mobile */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
            Department
          </span>
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              variant={categoryParam === "all" ? "default" : "outline"}
              className="rounded-xl text-xs h-8"
              onClick={() => onCategoryChange("all")}
            >
              All Departments
            </Button>
            {mockCategories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={categoryParam === cat.id ? "default" : "outline"}
                className="rounded-xl text-xs h-8"
                onClick={() => onCategoryChange(categoryParam === cat.id ? "all" : cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Workplace Type in Mobile */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
            Workplace Type
          </span>
          <div className="flex flex-wrap gap-1.5">
            {WORK_MODE_OPTIONS.map((opt) => (
              <Button
                key={opt.id}
                size="sm"
                variant={workModeParam === opt.id ? "default" : "outline"}
                className="rounded-xl text-xs h-8"
                onClick={() => onWorkModeChange(opt.id)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Employment Type in Mobile */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
            Employment Type
          </span>
          <div className="flex flex-wrap gap-1.5">
            {EMPLOYMENT_OPTIONS.map((opt) => {
              const isChecked = employmentList.includes(opt.id);
              return (
                <Button
                  key={opt.id}
                  size="sm"
                  variant={isChecked ? "default" : "outline"}
                  className="rounded-xl text-xs h-8"
                  onClick={() => onToggleEmployment(opt.id)}
                >
                  {opt.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Seniority Level in Mobile */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
            Seniority Level
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SENIORITY_OPTIONS.map((opt) => {
              const isChecked = seniorityList.includes(opt.id);
              return (
                <Button
                  key={opt.id}
                  size="sm"
                  variant={isChecked ? "default" : "outline"}
                  className="rounded-xl text-xs h-8"
                  onClick={() => onToggleSeniority(opt.id)}
                >
                  {opt.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Minimum Salary Slider in Mobile */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Minimum Base Salary
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
        </div>

        {/* Sheet Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-border/60">
          <Button
            variant="outline"
            onClick={onResetAll}
            className="flex-1 rounded-xl h-11"
          >
            Reset
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="flex-[2] rounded-xl h-11 font-semibold"
          >
            View {totalJobs} Jobs
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
