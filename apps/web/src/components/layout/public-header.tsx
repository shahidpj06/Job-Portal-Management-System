import { skipToken } from '@reduxjs/toolkit/query/react';
import { Briefcase, LogIn, Menu } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
import { useGetProfileFileAccessQuery, useGetProfileQuery } from '@/services/profile/profile.api';
import { APP_CONFIG } from '@/utils/global-config';
import { paths } from '@/utils/paths';

import { AccountMenu } from './account-menu';

const NAV_LINKS = [
  { label: 'Find Jobs', href: paths.jobs },
  // { label: 'Categories', href: `${paths.jobs}?view=categories` },
  // { label: 'About', href: '#about' }
];

export const PublicHeader = () => {
  const { isAuthenticated, user, logout, status, isLoading: isSigningOut } = useAuthSession();

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userId = isAuthenticated ? user?.id : undefined;

  const { currentData: profileResponse } = useGetProfileQuery(userId ?? skipToken);

  const hasAvatar = useMemo(
    () =>
      profileResponse?.data.profile.profileFiles.some((file) => file.kind === 'AVATAR') ?? false,
    [profileResponse]
  );

  const { currentData: avatarResponse } = useGetProfileFileAccessQuery(
    userId && hasAvatar ? { userId, kind: 'avatar' } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 4 * 60 * 1000
    }
  );

  const navigationLinks = useMemo(() => {
    const isCategoriesView =
      location.pathname === paths.jobs &&
      new URLSearchParams(location.search).get('view') === 'categories';

    return NAV_LINKS.map((link) => ({
      ...link,
      active:
        link.href === paths.jobs
          ? location.pathname === paths.jobs && !isCategoriesView
          : link.href.includes('view=categories')
            ? isCategoriesView
            : location.hash === link.href
    }));
  }, [location.pathname, location.search, location.hash]);

  const onMobileOpenChange = useCallback((open: boolean) => {
    setMobileOpen(open);
  }, []);

  const onCloseMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const onLogout = useCallback(async () => {
    if (isSigningOut) {
      return;
    }

    try {
      await logout();
    } catch {
      toast.error('Server sign-out failed. Your local session was cleared.');
    } finally {
      navigate(paths.home, { replace: true });
    }
  }, [isSigningOut, logout, navigate]);

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/80 bg-surface/90 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 md:px-8'>
        <div className='flex min-w-0 items-center gap-2'>
          <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
            <SheetTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                aria-label='Open navigation menu'
                className='shrink-0 rounded-xl md:hidden'
              >
                <Menu aria-hidden='true' className='size-5' />
              </Button>
            </SheetTrigger>

            <SheetContent side='left' className='w-72 max-w-[85vw] overflow-y-auto p-6'>
              <SheetTitle className='mb-2 flex items-center gap-2 text-lg font-bold'>
                <span className='flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <Briefcase aria-hidden='true' className='size-4' />
                </span>
                {APP_CONFIG.name}
              </SheetTitle>

              <SheetDescription className='sr-only'>Main website navigation</SheetDescription>

              <nav aria-label='Mobile navigation' className='mt-6 grid gap-2'>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={onCloseMobileMenu}
                    aria-current={link.active ? 'page' : undefined}
                    className={`rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                      link.active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            to={paths.home}
            className='flex min-w-0 items-center gap-2 text-xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-90'
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
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={link.active ? 'page' : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                link.active
                  ? 'bg-surface font-semibold text-primary shadow-2xs'
                  : 'text-muted-foreground hover:bg-surface/50 hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='flex shrink-0 items-center gap-2'>
          {status === 'checking' ? (
            <Skeleton className='size-10 rounded-full' />
          ) : isAuthenticated && user ? (
            <AccountMenu
              key={user.id}
              user={user}
              avatarUrl={avatarResponse?.data.file.url}
              isSigningOut={isSigningOut}
              onLogout={onLogout}
            />
          ) : (
            <>
              <Button variant='ghost' size='sm' asChild className='rounded-xl'>
                <Link to={paths.auth.login}>
                  <LogIn aria-hidden='true' className='hidden size-4 sm:block' />
                  Sign In
                </Link>
              </Button>

              <Button size='sm' asChild className='hidden rounded-xl font-semibold lg:inline-flex'>
                <Link to={paths.auth['sign-up']}>Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
