import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types";
import { formatApplicationStatus } from "@/utils/formatters";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  REVIEWING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  INTERVIEWING: "bg-purple-50 text-purple-700 border-purple-200",
  OFFER: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  HIRED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge className={`border text-xs font-medium ${STATUS_STYLES[status]}`}>
      {formatApplicationStatus(status)}
    </Badge>
  );
}
