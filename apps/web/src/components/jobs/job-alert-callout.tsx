import { BellRing, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JobAlertCallout() {
  return <section className="mt-8 overflow-hidden rounded-2xl border border-primary/15 bg-primary/[0.045] p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><BellRing className="size-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-primary">Never miss a match</p><h2 className="mt-1 text-lg font-bold tracking-tight">Create a job alert for these roles</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Get notified when a new opportunity matches your filters and salary expectations.</p></div></div><Button variant="outline" className="shrink-0 rounded-xl border-primary/20 bg-surface">Create alert<ChevronRight className="size-4" /></Button></div></section>;
}
