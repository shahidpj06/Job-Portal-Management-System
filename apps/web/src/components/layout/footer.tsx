import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { APP_CONFIG } from "@/utils/global-config";
import { paths } from "@/utils/paths";

const FOOTER_LINKS = {
  "For Job Seekers": [
    { label: "Browse Jobs", href: paths.jobs },
    { label: "Saved Jobs", href: paths.jobs },
    { label: "Job Alerts", href: paths.jobs },
    { label: "Career Resources", href: paths.home },
  ],
  "For Employers": [
    { label: "Post a Job", href: paths.admin['new-job'] },
    { label: "Browse Candidates", href: paths.admin.jobs },
    { label: "Pricing", href: paths.home },
    { label: "Employer Resources", href: paths.home },
  ],
  "Company": [
    { label: "About Us", href: paths.home },
    { label: "Blog", href: paths.home },
    { label: "Contact", href: paths.home },
    { label: "Privacy Policy", href: paths.home },
  ],
  "Support": [
    { label: "Help Center", href: paths.home },
    { label: "Terms of Service", href: paths.home },
    { label: "Cookie Policy", href: paths.home },
    { label: "Accessibility", href: paths.home },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0B0F19] text-slate-400">
      <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-3">
            <Link to={paths.home} className="flex items-center gap-2.5 text-lg font-bold text-white tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Briefcase className="h-4 w-4 text-indigo-400" />
              </div>
              <span>{APP_CONFIG.name}</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Find your dream job or the top talent with {APP_CONFIG.name} — the modern job board platform.
            </p>
          </div>

          {/* Navigation Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="space-y-3.5">
              <h4 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-slate-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
