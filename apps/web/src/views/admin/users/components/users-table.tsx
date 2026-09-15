import { memo, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { AuthUserRole } from '@/types/auth';
import type { IUserDirectoryItem } from '@/types/user-directory';

interface UsersTableProps {
  users: IUserDirectoryItem[];
}

const ROLE_LABELS: Record<AuthUserRole, string> = {
  USER: 'Candidate',
  ADMIN: 'Admin'
};

const joinedDateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
});

export const UsersTable = memo((props: UsersTableProps) => {
  const rows = useMemo(
    () =>
      props.users.map((user) => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        joinedDate: joinedDateFormatter.format(new Date(user.createdAt))
      })),
    [props.users]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((user) => (
          <TableRow key={user.id}>
            <TableCell className='font-medium'>{user.fullName}</TableCell>

            <TableCell className='text-muted-foreground'>{user.email}</TableCell>

            <TableCell>
              <Badge variant='outline'>{ROLE_LABELS[user.role]}</Badge>
            </TableCell>

            <TableCell className='text-muted-foreground'>
              <time dateTime={user.createdAt}>{user.joinedDate}</time>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

UsersTable.displayName = 'UsersTable';
