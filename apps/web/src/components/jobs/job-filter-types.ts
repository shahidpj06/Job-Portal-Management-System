import type { EmploymentType, ExperienceLevel, WorkMode } from "@/types";

export interface JobFiltersState {
  categoryId: string;
  employmentType: EmploymentType | "all";
  workMode: WorkMode | "all";
  experienceLevel: ExperienceLevel | "all";
  location: string;
}

export interface JobFiltersActions {
  onCategoryChange: (value: string) => void;
  onEmploymentTypeChange: (value: EmploymentType | "all") => void;
  onWorkModeChange: (value: WorkMode | "all") => void;
  onExperienceLevelChange: (value: ExperienceLevel | "all") => void;
  onLocationChange: (value: string) => void;
  onClear: () => void;
}
