import { Link } from "react-router-dom";
import { MapPin, Clock, Building2, Bookmark } from "lucide-react";
import type { Job } from "@/types";
import {
  formatSalary,
  formatRelativeDate,
  formatEmploymentType,
  formatWorkMode,
} from "@/utils/formatters";
import { PATHS } from "@/utils/paths";

interface JobCardProps {
  job: Job;
  compact?: boolean;
  className?: string;
}

// Work-mode pill styles matching Stitch design
const WORK_MODE_STYLES: Record<string, string> = {
  REMOTE: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  HYBRID: "bg-sky-50 text-sky-700 border-sky-200/80",
  ON_SITE: "bg-amber-50 text-amber-700 border-amber-200/80",
};

export function JobCard({ job, compact = false, className = "" }: JobCardProps) {
  const initials = job.company.name.charAt(0).toUpperCase();

  return (
    <div
      className={`group relative rounded-2xl border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[0_4px_12px_-2px_rgba(15,23,42,0.08),0_2px_4px_-2px_rgba(15,23,42,0.04)] ${className}`}
    >
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-start gap-4">
          {/* Company Avatar */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground/70 border border-border/50">
            {job.company.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Core Content */}
          <div className="min-w-0 flex-1">
            {/* Title row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 space-y-0.5">
                <Link
                  to={PATHS.JOB_DETAILS(job.id)}
                  className="block truncate text-base font-bold tracking-tight text-foreground transition-colors hover:text-primary sm:text-[17px]"
                >
                  {job.title}
                </Link>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium">{job.company.name}</span>
                </div>
              </div>

              {/* Bookmark */}
              <button
                aria-label="Save job"
                className="mt-0.5 shrink-0 rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-primary"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>

            {/* Badges */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  WORK_MODE_STYLES[job.workMode] ??
                  "bg-muted text-muted-foreground border-border"
                }`}
              >
                {formatWorkMode(job.workMode)}
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {formatEmploymentType(job.employmentType)}
              </span>
            </div>

            {/* Overview */}
            {!compact && (
              <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {job.overview}
              </p>
            )}

            {/* Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-border/40 pt-3.5">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatRelativeDate(job.postedAt)}
                </span>
              </div>

              {/* Salary — indigo text like the Stitch design */}
              <span className="text-sm font-bold text-primary">
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
