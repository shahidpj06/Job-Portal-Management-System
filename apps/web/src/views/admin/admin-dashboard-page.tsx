import { Link } from "react-router-dom";
import { Briefcase, Users, TrendingUp, Clock, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDashboardMetrics, mockJobs, mockApplications } from "@/mocks";
import { formatRelativeDate, formatApplicationStatus } from "@/utils/formatters";
import { PATHS } from "@/utils/paths";

const RECENT_JOBS = mockJobs.slice(0, 5);
const RECENT_APPS = mockApplications.slice(0, 5);

const STATUS_STYLES: Record<string, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  REVIEWING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  INTERVIEWING: "bg-purple-50 text-purple-700 border-purple-200",
  OFFER: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  HIRED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const STAT_CARDS = [
  {
    label: "Total Jobs",
    value: mockDashboardMetrics.totalJobs,
    icon: Briefcase,
    change: "+3 this week",
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Jobs",
    value: mockDashboardMetrics.activeJobs,
    icon: TrendingUp,
    change: `${mockDashboardMetrics.jobsPostedThisMonth} posted this month`,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Applications",
    value: mockDashboardMetrics.totalApplications,
    icon: Users,
    change: "+12 today",
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "This Month",
    value: mockDashboardMetrics.jobsPostedThisMonth,
    icon: Clock,
    change: "Jobs posted",
    color: "bg-orange-50 text-orange-600",
  },
];

export function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, change, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <div className={`rounded-lg p-2 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Job Listings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to={PATHS.ADMIN.JOBS}>
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {RECENT_JOBS.map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company.name} · {formatRelativeDate(job.createdAt)}</p>
                </div>
                <Badge
                  className={`ml-2 shrink-0 text-xs ${
                    job.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : job.status === "DRAFT" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-muted text-muted-foreground"
                  } border`}
                >
                  {job.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {RECENT_APPS.map((app) => (
              <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {app.user ? `${app.user.firstName} ${app.user.lastName}` : "Candidate"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {app.job?.title ?? "Unknown role"} · {formatRelativeDate(app.appliedAt)}
                  </p>
                </div>
                <Badge className={`ml-2 shrink-0 text-xs border ${STATUS_STYLES[app.status] ?? ""}`}>
                  {formatApplicationStatus(app.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 pt-0">
          <Button asChild>
            <Link to={PATHS.ADMIN.NEW_JOB}>
              <Plus className="mr-1.5 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={PATHS.ADMIN.JOBS}>Manage Jobs</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
