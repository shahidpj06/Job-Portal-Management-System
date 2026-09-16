import {
  Bell,
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  Menu,
  User,
  Users
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/utils/global-config';
import { paths } from '@/utils/paths';
import { AuthenticatedAccountMenu } from '@/app/layouts/authenticated-account-menu';


const ADMIN_NAVIGATION = [
  {
    href: paths.admin.dashboard,
    icon: LayoutDashboard,
    label: 'Dashboard'
  },
  {
    href: paths.admin.jobs,
    icon: Briefcase,
    label: 'Jobs'
  },
  {
    href: paths.admin.applications,
    icon: FileText,
    label: 'Applications'
  },
  {
    href: paths.admin.companies,
    icon: Building2,
    label: 'Companies'
  },
  {
    href: paths.admin.users,
    icon: Users,
    label: 'Users'
  },
  {
    href: paths.admin.profile,
    icon: User,
    label: 'Profile'
  }
];

const isAdminNavigationActive = (currentPath: string, navigationPath: string) => {
  if (navigationPath === paths.admin.dashboard) {
    return currentPath === navigationPath;
  }

  return currentPath === navigationPath || currentPath.startsWith(`${navigationPath}/`);
};

export const AdminTopbar = () => {
  const location = useLocation();

  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

  const pageTitle = useMemo(() => {
    const activeNavigationItem = ADMIN_NAVIGATION.find((navigationItem) =>
      isAdminNavigationActive(location.pathname, navigationItem.href)
    );

    return activeNavigationItem?.label ?? 'Admin';
  }, [location.pathname]);

  const handleMobileNavigationClose = useCallback(() => {
    setIsMobileNavigationOpen(false);
  }, []);

  const handleMobileNavigationOpenChange = useCallback((isOpen: boolean) => {
    setIsMobileNavigationOpen(isOpen);
  }, []);

  return (
    <header className='flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6'>
      <div className='flex items-center gap-3'>
        <Sheet onOpenChange={handleMobileNavigationOpenChange} open={isMobileNavigationOpen}>
          <SheetTrigger asChild className='lg:hidden'>
            <Button aria-label='Open navigation' size='icon' type='button' variant='ghost'>
              <Menu aria-hidden='true' className='size-5' />
            </Button>
          </SheetTrigger>

          <SheetContent className='w-64 p-0' side='left'>
            <SheetTitle className='flex h-16 items-center gap-2 border-b border-border px-4 text-lg font-bold text-primary'>
              <Briefcase aria-hidden='true' className='size-5' />

              {APP_CONFIG.name}
            </SheetTitle>

            <SheetDescription className='sr-only'>Admin navigation</SheetDescription>

            <nav aria-label='Admin navigation' className='flex flex-col gap-1 p-3'>
              {ADMIN_NAVIGATION.map((navigationItem) => {
                const isActive = isAdminNavigationActive(location.pathname, navigationItem.href);

                const NavigationIcon = navigationItem.icon;

                return (
                  <Link
                    key={navigationItem.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    onClick={handleMobileNavigationClose}
                    to={navigationItem.href}
                  >
                    <NavigationIcon aria-hidden='true' className='size-5 shrink-0' />

                    {navigationItem.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <h1 className='text-lg font-semibold'>{pageTitle}</h1>
      </div>

      <div className='flex items-center gap-2'>
        <Button aria-label='Notifications' size='icon' type='button' variant='ghost'>
          <Bell aria-hidden='true' className='size-5' />
        </Button>

        <AuthenticatedAccountMenu />
      </div>
    </header>
  );
};
