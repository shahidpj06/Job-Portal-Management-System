import { FileText, LoaderCircle, LogOut, Shield, UserRound } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { AuthUser } from '@/types';
import { getInitials } from '@/utils/formatters';
import { paths } from '@/utils/paths';

interface IAccountMenuProps {
  user: AuthUser;
  avatarUrl?: string;
  isSigningOut: boolean;
  onLogout: () => void;
}

export const AccountMenu = (props: IAccountMenuProps) => {
  const { user, avatarUrl, isSigningOut, onLogout } = props;

  const initials = useMemo(
    () => getInitials(user.firstName, user.lastName),
    [user.firstName, user.lastName]
  );

  const isAdmin = user.role === 'ADMIN';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          disabled={isSigningOut}
          aria-label='Open account menu'
          className='size-10 rounded-full p-0 ring-1 ring-border hover:ring-primary'
        >
          <Avatar className='size-10'>
            <AvatarImage src={avatarUrl} alt='' />
            <AvatarFallback className='bg-primary/10 font-semibold text-primary'>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={10}
        className='w-64 max-w-[calc(100vw-2rem)] rounded-xl p-2'
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className='px-2 py-2'>
            <span className='block truncate text-sm font-semibold text-foreground'>
              {user.firstName} {user.lastName}
            </span>
            <span className='mt-0.5 block truncate text-xs font-normal text-muted-foreground'>
              {user.email}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {isAdmin ? (
            <DropdownMenuItem asChild className='cursor-pointer gap-3 px-2 py-3'>
              <Link to={paths.admin.dashboard}>
                <Shield aria-hidden='true' className='size-4' />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild className='cursor-pointer gap-3 px-2 py-3'>
              <Link to={paths.applications}>
                <FileText aria-hidden='true' className='size-4' />
                My Applications
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild className='cursor-pointer gap-3 px-2 py-3'>
            <Link to={isAdmin ? paths.admin.profile : paths.profile}>
              <UserRound aria-hidden='true' className='size-4' />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant='destructive'
          disabled={isSigningOut}
          onClick={onLogout}
          className='cursor-pointer gap-3 px-2 py-3'
        >
          {isSigningOut ? (
            <LoaderCircle aria-hidden='true' className='size-4 animate-spin' />
          ) : (
            <LogOut aria-hidden='true' className='size-4' />
          )}
          {isSigningOut ? 'Signing out…' : 'Sign Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
