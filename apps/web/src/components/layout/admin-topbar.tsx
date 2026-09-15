import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, Briefcase, LayoutDashboard, User, FileText, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthSession } from '@/services/auth';
import { paths } from '@/utils/paths';
import { APP_CONFIG } from '@/utils/global-config';
import { getInitials } from '@/utils/formatters';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { label: 'Dashboard', href: paths.admin.dashboard, icon: LayoutDashboard },
  { label: 'Jobs', href: paths.admin.jobs, icon: Briefcase },
  {
    label: 'Applications',
    href: paths.admin.applications,
    icon: FileText
  },
  {
    label: 'Companies',
    href: paths.admin.companies,
    icon: Building2
  },
  {
    label: 'Users',
    href: paths.admin.users,
    icon: Users
  },
  { label: 'Profile', href: paths.admin.profile, icon: User }
];

export const AdminTopbar = () => {
  const { user, logout } = useAuthSession();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = ADMIN_NAV.find((n) => location.pathname.startsWith(n.href))?.label ?? 'Admin';

  return (
    <header className='flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6'>
      <div className='flex items-center gap-3'>
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className='lg:hidden'>
            <Button variant='ghost' size='icon' aria-label='Open navigation'>
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-64 p-0'>
            <SheetTitle className='flex h-16 items-center gap-2 border-b border-border px-4 text-lg font-bold text-primary'>
              <Briefcase className='h-5 w-5' />
              {APP_CONFIG.name}
            </SheetTitle>
            <nav className='flex flex-col gap-1 p-3'>
              {ADMIN_NAV.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className='h-5 w-5 shrink-0' />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <h1 className='text-lg font-semibold'>{pageTitle}</h1>
      </div>

      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' aria-label='Notifications'>
          <Bell className='h-5 w-5' />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-9 gap-2 px-2'>
              <Avatar className='h-7 w-7'>
                <AvatarFallback className='bg-primary text-primary-foreground text-xs'>
                  {user ? getInitials(user.firstName, user.lastName) : 'A'}
                </AvatarFallback>
              </Avatar>
              <span className='hidden text-sm font-medium sm:inline-block'>
                {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuItem asChild>
              <Link to={paths.admin.profile}>My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={paths.home}>View Site</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void logout()}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
