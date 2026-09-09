import { CheckCircle2 } from "lucide-react";
import type { CareerMilestone } from "@/mocks";

interface CareerProgressVisualProps {
  milestones: CareerMilestone[];
  className?: string;
}

export function CareerProgressVisual({
  milestones,
  className = "",
}: CareerProgressVisualProps) {
  return (
    <div
      className={`rounded-2xl border border-border/80 bg-gradient-to-br from-muted/50 via-surface to-primary/5 p-6 sm:p-8 shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-3.5">
        {milestones.map((milestone) => (
          <div
            key={milestone.step}
            className="flex items-center gap-3.5 rounded-xl border border-border/80 bg-surface p-3.5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
          >
            {/* Step numeral circle */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-2xs">
              {milestone.step}
            </div>

            {/* Title */}
            <div className="flex-1 font-medium text-foreground text-sm">
              {milestone.title}
            </div>

            {/* Status indicator */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-tertiary">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
