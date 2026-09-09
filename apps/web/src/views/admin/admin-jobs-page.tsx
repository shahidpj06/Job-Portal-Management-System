import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/common";
import { mockJobs } from "@/mocks";
import type { Job } from "@/types";
import { formatRelativeDate, formatEmploymentType } from "@/utils/formatters";
import { PATHS } from "@/utils/paths";

const JOB_STATUS_COLORS: Record<Job["status"], string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DRAFT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CLOSED: "bg-muted text-muted-foreground",
};

export function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(query.toLowerCase()) ||
          j.company.name.toLowerCase().includes(query.toLowerCase())
      )
    : jobs;

  function deleteJob(id: string) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <PageHeader
        title="Job Listings"
        description={`${jobs.length} jobs total`}
        actions={
          <Button asChild>
            <Link to={PATHS.ADMIN.NEW_JOB}>
              <Plus className="mr-1.5 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-job-search"
              placeholder="Search jobs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell className="text-muted-foreground">{job.company.name}</TableCell>
                    <TableCell className="text-muted-foreground">{formatEmploymentType(job.employmentType)}</TableCell>
                    <TableCell>
                      <Badge className={`border text-xs ${JOB_STATUS_COLORS[job.status]}`}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{job.applicationCount}</TableCell>
                    <TableCell className="text-muted-foreground">{formatRelativeDate(job.postedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link to={PATHS.ADMIN.EDIT_JOB(job.id)} aria-label={`Edit ${job.title}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label={`Delete ${job.title}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Job Listing?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove &ldquo;{job.title}&rdquo; and all associated data. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteJob(job.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {filtered.map((job) => (
              <div key={job.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.company.name}</p>
                  </div>
                  <Badge className={`border text-xs ${JOB_STATUS_COLORS[job.status]}`}>{job.status}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{job.applicationCount} applicants · {formatRelativeDate(job.postedAt)}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <Link to={PATHS.ADMIN.EDIT_JOB(job.id)}><Edit className="h-3.5 w-3.5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteJob(job.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">No jobs match your search.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
