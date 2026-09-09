import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Briefcase, Menu, X, LogIn, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useMockSession } from "@/providers/mock-session-provider";
import { PATHS } from "@/utils/paths";
import { APP_CONFIG } from "@/utils/global-config";

const NAV_LINKS = [
  { label: "Find Jobs", href: PATHS.JOBS },
  { label: "Categories", href: `${PATHS.JOBS}?view=categories` },
  { label: "About", href: "#about" },
];

export function PublicHeader() {
  const { isAuthenticated, isAdmin, user, logout } = useMockSession();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isNavActive = (href: string) => {
    if (href === PATHS.JOBS) {
      return location.pathname === PATHS.JOBS && !location.search.includes("categories");
    }
    if (href.includes("categories")) {
      return location.search.includes("categories");
    }
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-surface/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8">
        {/* Brand Logo */}
        <Link to={PATHS.HOME} className="flex items-center gap-2.5 font-extrabold text-xl text-foreground tracking-tight hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Briefcase className="h-5 w-5" />
          </div>
          <span>{APP_CONFIG.name}</span>
        </Link>

        {/* Center Desktop Navigation Pill */}
        <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isNavActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-surface text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Button variant="ghost" size="sm" asChild className="rounded-xl text-muted-foreground hover:text-foreground">
                  <Link to={PATHS.ADMIN.DASHBOARD}>
                    <Shield className="mr-1.5 h-4 w-4 text-primary" />
                    Admin
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="rounded-xl text-muted-foreground hover:text-foreground">
                    <Link to={PATHS.APPLICATIONS}>My Applications</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="rounded-xl text-muted-foreground hover:text-foreground">
                    <Link to={PATHS.PROFILE}>Profile</Link>
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={logout} className="rounded-xl border-border hover:bg-muted font-medium">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="rounded-xl text-muted-foreground hover:text-foreground font-medium">
                <Link to={PATHS.ADMIN.DASHBOARD}>
                  <Shield className="mr-1.5 h-4 w-4 text-primary" />
                  Admin
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="rounded-xl text-muted-foreground hover:text-foreground font-medium">
                <Link to={PATHS.LOGIN}>
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm px-4">
                <Link to={PATHS.SIGNUP}>Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-xl">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-6">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold text-foreground mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="h-4 w-4" />
              </div>
              {APP_CONFIG.name}
            </SheetTitle>
            <nav className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-medium hover:bg-muted text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-border" />
              {isAuthenticated ? (
                <>
                  {!isAdmin && (
                    <>
                      <Link to={PATHS.APPLICATIONS} onClick={() => setMobileOpen(false)} className="rounded-xl px-3.5 py-2 text-sm font-medium hover:bg-muted text-foreground">
                        My Applications
                      </Link>
                      <Link to={PATHS.PROFILE} onClick={() => setMobileOpen(false)} className="rounded-xl px-3.5 py-2 text-sm font-medium hover:bg-muted text-foreground">
                        Profile
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link to={PATHS.ADMIN.DASHBOARD} onClick={() => setMobileOpen(false)} className="rounded-xl px-3.5 py-2 text-sm font-medium hover:bg-muted text-foreground">
                      Admin Dashboard
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={() => { logout(); setMobileOpen(false); }} className="mt-3 rounded-xl">
                    Sign Out ({user?.firstName})
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link to={PATHS.ADMIN.DASHBOARD} onClick={() => setMobileOpen(false)} className="rounded-xl px-3.5 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">
                    Admin Portal
                  </Link>
                  <Button variant="outline" size="sm" asChild className="rounded-xl">
                    <Link to={PATHS.LOGIN} onClick={() => setMobileOpen(false)}>Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="rounded-xl bg-primary text-primary-foreground font-semibold">
                    <Link to={PATHS.SIGNUP} onClick={() => setMobileOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
