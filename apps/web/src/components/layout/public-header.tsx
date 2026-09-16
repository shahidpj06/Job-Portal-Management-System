import { Briefcase, LogIn, Menu } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthSession } from '@/services/auth';
import { APP_CONFIG } from '@/utils/global-config';
import { paths } from '@/utils/paths';
import { AuthenticatedAccountMenu } from '@/app/layouts/authenticated-account-menu';

const NAVIGATION_LINKS = [
  {
    href: paths.jobs,
    label: 'Find Jobs'
  }
];

export const PublicHeader = () => {
  const { isAuthenticated, status, user } = useAuthSession();
  const location = useLocation();
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

  const navigationLinks = useMemo(
    () =>
      NAVIGATION_LINKS.map((navigationLink) => {
        const isActive = location.pathname === navigationLink.href;

        return {
          ...navigationLink,
          isActive
        };
      }),
    [location.pathname]
  );

  const handleMobileNavigationClose = useCallback(() => {
    setIsMobileNavigationOpen(false);
  }, []);

  const handleMobileNavigationOpenChange = useCallback((isOpen: boolean) => {
    setIsMobileNavigationOpen(isOpen);
  }, []);

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/80 bg-surface/90 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 md:px-8'>
        <div className='flex min-w-0 items-center gap-2'>
          <Sheet onOpenChange={handleMobileNavigationOpenChange} open={isMobileNavigationOpen}>
            <SheetTrigger asChild>
              <Button
                aria-label='Open navigation menu'
                className='shrink-0 rounded-xl md:hidden'
                size='icon'
                type='button'
                variant='ghost'
              >
                <Menu aria-hidden='true' className='size-5' />
              </Button>
            </SheetTrigger>

            <SheetContent className='w-72 max-w-[85vw] overflow-y-auto p-6' side='left'>
              <SheetTitle className='mb-2 flex items-center gap-2 text-lg font-bold'>
                <span className='flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <Briefcase aria-hidden='true' className='size-4' />
                </span>

                {APP_CONFIG.name}
              </SheetTitle>

              <SheetDescription className='sr-only'>Main website navigation</SheetDescription>

              <nav aria-label='Mobile navigation' className='mt-6 grid gap-2'>
                {navigationLinks.map((navigationLink) => (
                  <Link
                    key={navigationLink.href}
                    aria-current={navigationLink.isActive ? 'page' : undefined}
                    className={
                      navigationLink.isActive
                        ? 'rounded-xl bg-primary/10 px-3.5 py-3 text-sm font-medium text-primary transition-colors'
                        : 'rounded-xl px-3.5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted'
                    }
                    onClick={handleMobileNavigationClose}
                    to={navigationLink.href}
                  >
                    {navigationLink.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            className='flex min-w-0 items-center gap-2 text-xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-90'
            to={paths.home}
          >
            <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <Briefcase aria-hidden='true' className='size-5' />
            </span>

            <span className='truncate'>{APP_CONFIG.name}</span>
          </Link>
        </div>

        <nav
          aria-label='Main navigation'
          className='hidden items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1 md:flex'
        >
          {navigationLinks.map((navigationLink) => (
            <Link
              key={navigationLink.href}
              aria-current={navigationLink.isActive ? 'page' : undefined}
              className={
                navigationLink.isActive
                  ? 'rounded-full bg-surface px-4 py-1.5 text-sm font-semibold text-primary shadow-2xs transition-colors'
                  : 'rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface/50 hover:text-foreground'
              }
              to={navigationLink.href}
            >
              {navigationLink.label}
            </Link>
          ))}
        </nav>

        <div className='flex shrink-0 items-center gap-2'>
          {status === 'checking' ? (
            <Skeleton className='size-10 rounded-full' />
          ) : isAuthenticated && user ? (
            <AuthenticatedAccountMenu />
          ) : (
            <>
              <Button asChild className='rounded-xl' size='sm' variant='ghost'>
                <Link to={paths.auth.login}>
                  <LogIn aria-hidden='true' className='hidden size-4 sm:block' />
                  Sign In
                </Link>
              </Button>

              <Button asChild className='hidden rounded-xl font-semibold lg:inline-flex' size='sm'>
                <Link to={paths.auth['sign-up']}>Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
