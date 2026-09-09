import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function JobsAlertBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    toast.success("Job alert activated! You'll receive updates for matching roles.");
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
    }, 2500);
  }

  return (
    <aside className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-secondary/10 border border-primary/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="space-y-1.5 max-w-xl text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-center md:justify-start gap-1.5">
          <Bell className="h-3.5 w-3.5" />
          Never miss a match
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Create custom alerts for matching opportunities
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Get instant notifications sent to your inbox when verified companies post new roles fitting your exact filters and salary requirements.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto"
      >
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-xl bg-surface sm:w-72 text-sm shadow-2xs"
          required
        />
        <Button
          type="submit"
          disabled={submitted}
          className="h-11 px-6 rounded-xl font-semibold whitespace-nowrap w-full sm:w-auto shadow-sm gap-2"
        >
          {submitted ? (
            <>
              <Check className="h-4 w-4" />
              <span>Subscribed!</span>
            </>
          ) : (
            <span>Activate Alert</span>
          )}
        </Button>
      </form>
    </aside>
  );
}
