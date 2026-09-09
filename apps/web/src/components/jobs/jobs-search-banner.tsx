import { useState } from "react";
import { Search, MapPin, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobsSearchBannerProps {
  initialQuery: string;
  initialLocation: string;
  onSearch: (query: string, location: string) => void;
}

export function JobsSearchBanner({
  initialQuery,
  initialLocation,
  onSearch,
}: JobsSearchBannerProps) {
  const [keyword, setKeyword] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(keyword.trim(), location.trim());
  }

  return (
    <section className="w-full border-b border-border/60 bg-muted/40 py-10 sm:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex flex-col gap-2.5 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Talent Marketplace
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl text-foreground">
            Find your next career defining role
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Discover verified opportunities across leading tech teams, high-growth scaleups, and remote-first innovators.
          </p>
        </div>

        {/* Search Console Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/80 bg-surface p-2 sm:p-2.5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-2"
        >
          {/* Keyword Input */}
          <div className="flex-1 flex items-center gap-2.5 rounded-xl bg-muted/50 px-3.5 py-2.5 text-foreground focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Role, tech stack, or company (e.g. Senior Frontend Engineer)"
              className="w-full bg-transparent text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => {
                  setKeyword("");
                  onSearch("", location);
                }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Clear keyword"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Location Input */}
          <div className="flex-1 flex items-center gap-2.5 rounded-xl bg-muted/50 px-3.5 py-2.5 text-foreground focus-within:ring-2 focus-within:ring-primary/20">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state or 'Remote'"
              className="w-full bg-transparent text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none"
            />
            {location && (
              <button
                type="button"
                onClick={() => {
                  setLocation("");
                  onSearch(keyword, "");
                }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Clear location"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            className="w-full md:w-auto h-11 px-6 rounded-xl font-semibold gap-2 shadow-sm shrink-0"
          >
            <span>Search Jobs</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}
