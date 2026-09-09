import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobListPaginationProps { page: number; pageCount: number; onPageChange: (page: number) => void; }

export function JobListPagination({ page, pageCount, onPageChange }: JobListPaginationProps) {
  if (pageCount <= 1) return null;
  return <nav aria-label="Job results pages" className="flex items-center justify-center gap-2 pt-3"><Button variant="outline" size="icon" className="rounded-xl" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page"><ChevronLeft className="size-4" /></Button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <Button key={item} variant={item === page ? "default" : "outline"} size="icon" className="rounded-xl" onClick={() => onPageChange(item)} aria-label={`Page ${item}`} aria-current={item === page ? "page" : undefined}>{item}</Button>)}<Button variant="outline" size="icon" className="rounded-xl" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page"><ChevronRight className="size-4" /></Button></nav>;
}
