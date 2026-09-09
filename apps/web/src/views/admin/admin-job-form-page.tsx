import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { mockJobs, mockCategories } from "@/mocks";
import { PATHS } from "@/utils/paths";
import type { EmploymentType, WorkMode, ExperienceLevel, JobStatus } from "@/types";
import { formatEmploymentType, formatWorkMode, formatExperience } from "@/utils/formatters";

const EMPLOYMENT_TYPES: EmploymentType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"];
const WORK_MODES: WorkMode[] = ["REMOTE", "HYBRID", "ON_SITE"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["ENTRY_LEVEL", "MID_LEVEL", "SENIOR_LEVEL", "DIRECTOR", "EXECUTIVE"];
const JOB_STATUSES: JobStatus[] = ["PUBLISHED", "DRAFT", "CLOSED"];

const jobFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  companyName: z.string().min(2, "Company name required"),
  location: z.string().min(2, "Location required"),
  categoryId: z.string().min(1, "Category required"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"]),
  workMode: z.enum(["REMOTE", "HYBRID", "ON_SITE"]),
  experienceLevel: z.enum(["ENTRY_LEVEL", "MID_LEVEL", "SENIOR_LEVEL", "DIRECTOR", "EXECUTIVE"]),
  status: z.enum(["PUBLISHED", "DRAFT", "CLOSED"]),
  salaryMin: z.number().min(0),
  salaryMax: z.number().min(0),
  overview: z.string().min(20, "Overview must be at least 20 characters"),
});

type JobFormData = z.infer<typeof jobFormSchema>;

export function AdminJobFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const existing = isEdit ? mockJobs.find((j) => j.id === id) : undefined;

  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: existing ? {
      title: existing.title,
      companyName: existing.company.name,
      location: existing.location,
      categoryId: existing.categoryId,
      employmentType: existing.employmentType,
      workMode: existing.workMode,
      experienceLevel: existing.experienceLevel,
      status: existing.status,
      salaryMin: existing.salary.min,
      salaryMax: existing.salary.max,
      overview: existing.overview,
    } : {
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      experienceLevel: "MID_LEVEL",
      status: "DRAFT",
      salaryMin: 80000,
      salaryMax: 120000,
    },
  });

  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const selectedEmploymentType = useWatch({ control, name: "employmentType" });
  const selectedWorkMode = useWatch({ control, name: "workMode" });
  const selectedExperienceLevel = useWatch({ control, name: "experienceLevel" });
  const selectedStatus = useWatch({ control, name: "status" });

  async function onSubmit(_data: JobFormData) {
    await new Promise((r) => setTimeout(r, 700));
    navigate(PATHS.ADMIN.JOBS);
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link to={PATHS.ADMIN.JOBS}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>

      <PageHeader
        title={isEdit ? "Edit Job" : "Post New Job"}
        description={isEdit ? `Editing: ${existing?.title}` : "Fill in the details to create a new listing"}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="job-title">Job Title *</Label>
                  <Input id="job-title" placeholder="e.g. Senior Frontend Developer" {...register("title")} />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="job-company">Company Name *</Label>
                    <Input id="job-company" placeholder="Acme Inc." {...register("companyName")} />
                    {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="job-location">Location *</Label>
                    <Input id="job-location" placeholder="Remote / City, Country" {...register("location")} />
                    {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="job-overview">Job Overview *</Label>
                  <Textarea id="job-overview" placeholder="Describe the role and your ideal candidate…" rows={5} {...register("overview")} />
                  {errors.overview && <p className="text-xs text-destructive">{errors.overview.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Salary Range</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="salary-min">Minimum (USD/year)</Label>
                    <Input id="salary-min" type="number" min={0} step={1000} {...register("salaryMin", { valueAsNumber: true })} />
                    {errors.salaryMin && <p className="text-xs text-destructive">{errors.salaryMin.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="salary-max">Maximum (USD/year)</Label>
                    <Input id="salary-max" type="number" min={0} step={1000} {...register("salaryMax", { valueAsNumber: true })} />
                    {errors.salaryMax && <p className="text-xs text-destructive">{errors.salaryMax.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar selects */}
          <div className="space-y-5">
            <Card>
              <CardHeader><CardTitle className="text-base">Job Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select value={selectedCategoryId} onValueChange={(v) => setValue("categoryId", v, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Employment Type</Label>
                  <Select value={selectedEmploymentType} onValueChange={(v) => setValue("employmentType", v as EmploymentType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{formatEmploymentType(t)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Work Mode</Label>
                  <Select value={selectedWorkMode} onValueChange={(v) => setValue("workMode", v as WorkMode)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {WORK_MODES.map((m) => <SelectItem key={m} value={m}>{formatWorkMode(m)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Experience Level</Label>
                  <Select value={selectedExperienceLevel} onValueChange={(v) => setValue("experienceLevel", v as ExperienceLevel)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((l) => <SelectItem key={l} value={l}>{formatExperience(l)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={(v) => setValue("status", v as JobStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {JOB_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Post Job"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
