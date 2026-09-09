import type { EmploymentType, WorkMode, ExperienceLevel, ApplicationStatus, JobStatus } from "@/types";

export function formatSalary(min: number, max: number, currency = "USD"): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} – ${formatter.format(max)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(iso);
}

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

const WORK_MODE_LABELS: Record<WorkMode, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-site",
};

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  ENTRY_LEVEL: "Entry Level",
  MID_LEVEL: "Mid Level",
  SENIOR_LEVEL: "Senior Level",
  DIRECTOR: "Director",
  EXECUTIVE: "Executive",
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  REVIEWING: "In Review",
  INTERVIEWING: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  HIRED: "Hired",
};

const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  CLOSED: "Closed",
};

export function formatEmploymentType(type: EmploymentType): string {
  return EMPLOYMENT_LABELS[type];
}

export function formatWorkMode(mode: WorkMode): string {
  return WORK_MODE_LABELS[mode];
}

export function formatExperience(level: ExperienceLevel): string {
  return EXPERIENCE_LABELS[level];
}

export function formatApplicationStatus(status: ApplicationStatus): string {
  return STATUS_LABELS[status];
}

export function formatJobStatus(status: JobStatus): string {
  return JOB_STATUS_LABELS[status];
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
