import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Clock, Briefcase, Building2, Globe, ArrowLeft,
  CheckCircle, Users, ChevronRight, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockJobs, mockCategories } from "@/mocks";
import { useMockSession } from "@/providers/mock-session-provider";
import {
  formatSalary, formatRelativeDate, formatEmploymentType,
  formatWorkMode, formatExperience,
} from "@/utils/formatters";
import { PATHS } from "@/utils/paths";
import { JobCard } from "@/components/jobs";
import { ErrorState } from "@/components/common";

function Label2({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="text-sm font-medium">{children}</label>;
}
void Label2;

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useMockSession();
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const job = mockJobs.find((j) => j.id === id);
  const category = mockCategories.find((c) => c.id === job?.categoryId);
  const related = mockJobs.filter((j) => j.categoryId === job?.categoryId && j.id !== id && j.status === "PUBLISHED").slice(0, 3);

  if (!job) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-16">
        <ErrorState title="Job not found" description="This job may have been removed or expired." />
        <div className="mt-4 text-center">
          <Button asChild><Link to={PATHS.JOBS}>Browse Jobs</Link></Button>
        </div>
      </div>
    );
  }

  function handleApply() {
    if (!isAuthenticated) {
      navigate(PATHS.LOGIN);
      return;
    }
    setApplyOpen(true);
  }

  function handleSubmitApplication() {
    setSubmitted(true);
    setTimeout(() => { setApplyOpen(false); setSubmitted(false); setCoverLetter(""); }, 1500);
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-8">
      {/* Back */}
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
        <Link to={PATHS.JOBS}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl font-bold text-muted-foreground">
                  {job.company.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold sm:text-2xl">{job.title}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{job.company.name}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Posted {formatRelativeDate(job.postedAt)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{formatEmploymentType(job.employmentType)}</Badge>
                    <Badge variant="secondary">{formatWorkMode(job.workMode)}</Badge>
                    <Badge variant="secondary">{formatExperience(job.experienceLevel)}</Badge>
                    {category && <Badge variant="outline">{category.name}</Badge>}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Salary Range</p>
                  <p className="text-lg font-bold text-primary">
                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                    <span className="text-sm font-normal text-muted-foreground">/yr</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" aria-label="Share job">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={handleApply}>Apply Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{submitted ? "Application Submitted!" : `Apply for ${job.title}`}</DialogTitle>
                      </DialogHeader>
                      {submitted ? (
                        <div className="flex flex-col items-center gap-3 py-6">
                          <CheckCircle className="h-12 w-12 text-tertiary" />
                          <p className="text-sm text-muted-foreground text-center">
                            Your application has been submitted to {job.company.name}.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 mt-2">
                          <div className="rounded-lg bg-muted p-3 text-sm">
                            <strong>{job.title}</strong> @ {job.company.name}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cover-letter">Cover Letter (optional)</Label>
                            <Textarea
                              id="cover-letter"
                              placeholder="Tell the employer why you're a great fit…"
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              rows={5}
                            />
                          </div>
                          <Button className="w-full" onClick={handleSubmitApplication}>
                            Submit Application
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overview */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 text-lg font-semibold">About the Role</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{job.overview}</p>

              <h3 className="mt-6 mb-3 font-semibold">Key Responsibilities</h3>
              <ul className="space-y-2">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {r}
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 mb-3 font-semibold">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
                    {r}
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 mb-3 font-semibold">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b) => (
                  <Badge key={b} variant="secondary">{b}</Badge>
                ))}
              </div>

              <h3 className="mt-6 mb-3 font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold">Job Overview</h3>
              {[
                { icon: Briefcase, label: "Type", value: formatEmploymentType(job.employmentType) },
                { icon: Globe, label: "Work Mode", value: formatWorkMode(job.workMode) },
                { icon: MapPin, label: "Location", value: job.location },
                { icon: Users, label: "Experience", value: formatExperience(job.experienceLevel) },
                { icon: Users, label: "Applicants", value: `${job.applicationCount} applied` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 font-semibold">About {job.company.name}</h3>
              {job.company.description ? (
                <p className="text-sm text-muted-foreground">{job.company.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground">A great place to grow your career.</p>
              )}
              {job.company.website && (
                <a href={job.company.website} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1 text-sm text-primary hover:underline">
                  <Globe className="h-4 w-4" /> Visit website
                </a>
              )}
            </CardContent>
          </Card>

          <Button className="w-full" onClick={handleApply}>Apply for This Job</Button>
        </div>
      </div>

      {/* Related jobs */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Similar Jobs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((j) => <JobCard key={j.id} job={j} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}
