import { RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCategories } from "@/mocks";
import type { EmploymentType, ExperienceLevel, WorkMode } from "@/types";
import { formatEmploymentType, formatExperience, formatWorkMode } from "@/utils/formatters";
import type { JobFiltersActions, JobFiltersState } from "./job-filter-types";

const EMPLOYMENT_TYPES: EmploymentType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"];
const WORK_MODES: WorkMode[] = ["REMOTE", "HYBRID", "ON_SITE"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["ENTRY_LEVEL", "MID_LEVEL", "SENIOR_LEVEL", "DIRECTOR", "EXECUTIVE"];

interface JobFiltersProps extends JobFiltersState, JobFiltersActions { activeFiltersCount: number; compact?: boolean; }

function FilterField({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1.5"><span className="text-xs font-semibold text-foreground">{label}</span>{children}</label>; }

export function JobFilters({ categoryId, employmentType, workMode, experienceLevel, location, activeFiltersCount, onCategoryChange, onEmploymentTypeChange, onWorkModeChange, onExperienceLevelChange, onLocationChange, onClear, compact = false }: JobFiltersProps) {
  const selectClassName = "h-10 rounded-lg bg-surface text-sm";
  return <div className={compact ? "grid gap-4" : "grid gap-5"}><div className="flex items-center justify-between"><h2 className="text-lg font-bold tracking-tight">Filters</h2>{activeFiltersCount > 0 && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{activeFiltersCount}</span>}</div>
    <FilterField label="Location"><Select value={location} onValueChange={onLocationChange}><SelectTrigger className={selectClassName}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Anywhere / Remote</SelectItem><SelectItem value="Remote">Remote</SelectItem><SelectItem value="New York">New York, NY</SelectItem><SelectItem value="San Francisco">San Francisco, CA</SelectItem></SelectContent></Select></FilterField>
    <FilterField label="Category"><Select value={categoryId} onValueChange={onCategoryChange}><SelectTrigger className={selectClassName}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{mockCategories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></FilterField>
    <FilterField label="Employment type"><Select value={employmentType} onValueChange={(value) => onEmploymentTypeChange(value as EmploymentType | "all")}><SelectTrigger className={selectClassName}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem>{EMPLOYMENT_TYPES.map((type) => <SelectItem key={type} value={type}>{formatEmploymentType(type)}</SelectItem>)}</SelectContent></Select></FilterField>
    <FilterField label="Work mode"><Select value={workMode} onValueChange={(value) => onWorkModeChange(value as WorkMode | "all")}><SelectTrigger className={selectClassName}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All modes</SelectItem>{WORK_MODES.map((mode) => <SelectItem key={mode} value={mode}>{formatWorkMode(mode)}</SelectItem>)}</SelectContent></Select></FilterField>
    <FilterField label="Experience level"><Select value={experienceLevel} onValueChange={(value) => onExperienceLevelChange(value as ExperienceLevel | "all")}><SelectTrigger className={selectClassName}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All levels</SelectItem>{EXPERIENCE_LEVELS.map((level) => <SelectItem key={level} value={level}>{formatExperience(level)}</SelectItem>)}</SelectContent></Select></FilterField>
    {activeFiltersCount > 0 && <Button variant="outline" onClick={onClear} className="w-full gap-2 rounded-xl"><RotateCcw className="size-4" />Clear filters</Button>}</div>;
}

interface ActiveFilterChipsProps extends JobFiltersState { query: string; onQueryClear: () => void; onCategoryClear: () => void; onEmploymentTypeClear: () => void; onWorkModeClear: () => void; onExperienceLevelClear: () => void; onLocationClear: () => void; }

export function ActiveFilterChips(props: ActiveFilterChipsProps) {
  const chips = [props.query && { label: `“${props.query}”`, onClear: props.onQueryClear }, props.location !== "all" && { label: props.location, onClear: props.onLocationClear }, props.categoryId !== "all" && { label: mockCategories.find((category) => category.id === props.categoryId)?.name ?? "Category", onClear: props.onCategoryClear }, props.employmentType !== "all" && { label: formatEmploymentType(props.employmentType), onClear: props.onEmploymentTypeClear }, props.workMode !== "all" && { label: formatWorkMode(props.workMode), onClear: props.onWorkModeClear }, props.experienceLevel !== "all" && { label: formatExperience(props.experienceLevel), onClear: props.onExperienceLevelClear }].filter(Boolean) as { label: string; onClear: () => void }[];
  if (chips.length === 0) return null;
  return <div className="flex gap-2 overflow-x-auto pb-1"><span className="shrink-0 self-center text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Active filters</span>{chips.map((chip) => <button key={chip.label} type="button" onClick={chip.onClear} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10"><span>{chip.label}</span><X className="size-3" /></button>)}</div>;
}
