import { Link } from "react-router-dom";
import { Building2, MapPin, Clock, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types";
import {
  formatSalary,
  formatRelativeDate,
  formatEmploymentType,
  formatExperience,
} from "@/utils/formatters";
import { PATHS } from "@/utils/paths";

interface JobsFeedCardProps {
  job: Job;
  isFeatured?: boolean;
  isSaved?: boolean;
  onToggleSave: (id: string, title: string) => void;
}

const COMPANY_COLOR_PALETTES: Record<string, { bg: string; text: string }> = {
  NX: { bg: "bg-primary text-primary-foreground", text: "text-primary" },
  AV: { bg: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300", text: "text-blue-600" },
  KL: { bg: "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300", text: "text-violet-600" },
  VT: { bg: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300", text: "text-emerald-600" },
  OR: { bg: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300", text: "text-amber-600" },
  TC: { bg: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300", text: "text-indigo-600" },
  IA: { bg: "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300", text: "text-purple-600" },
  GF: { bg: "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300", text: "text-teal-600" },
  HP: { bg: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300", text: "text-rose-600" },
  EE: { bg: "bg-lime-100 dark:bg-lime-950 text-lime-700 dark:text-lime-300", text: "text-lime-600" },
};

function getCompanyPalette(name: string) {
  const letters = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return COMPANY_COLOR_PALETTES[letters] || {
    bg: "bg-primary/10 text-primary",
    text: "text-primary",
  };
}

export function JobsFeedCard({
  job,
  isFeatured = false,
  isSaved = false,
  onToggleSave,
}: JobsFeedCardProps) {
  const palette = getCompanyPalette(job.company.name);

  return (
    <article
      className={`group relative rounded-2xl border bg-surface p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isFeatured
          ? "border-primary/40 bg-gradient-to-r from-primary/[0.03] via-transparent to-transparent shadow-sm"
          : "border-border/80"
      }`}
    >
      {isFeatured && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-2xl"></div>
      )}

      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Left: Avatar + Details */}
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Company Avatar */}
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-extrabold text-base sm:text-lg shadow-sm shrink-0 ${palette.bg}`}
          >
            {job.company.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              job.company.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            )}
          </div>

          {/* Job Info */}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={PATHS.JOB_DETAILS(job.id)}
                className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer truncate"
              >
                {job.title}
              </Link>
              {isFeatured && (
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {job.company.name}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Posted {formatRelativeDate(job.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
          <button
            type="button"
            onClick={() => onToggleSave(job.id, job.title)}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved
                ? "bg-primary/10 border-primary/20 text-primary"
                : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={isSaved ? "Saved" : "Save Job"}
            aria-label="Save Job"
          >
            <Bookmark
              className="h-4 w-4"
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
          <Button
            asChild
            size="sm"
            className="rounded-xl px-4 font-semibold shadow-sm"
          >
            <Link to={PATHS.JOB_DETAILS(job.id)}>
              Apply Now
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Snippet */}
      <div className="my-3 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {job.overview}
      </div>

      {/* Badges & Salary Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-1.5">
          {job.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {formatEmploymentType(job.employmentType)}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            {formatExperience(job.experienceLevel)}
          </span>
        </div>

        <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
          {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
          <span className="text-xs text-muted-foreground font-normal"> / year</span>
        </div>
      </div>
    </article>
  );
}
