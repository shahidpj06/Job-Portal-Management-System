import { Building2, Mail } from 'lucide-react';

import { ChangePassword } from '@/components/auth/change-password';
import { PageHeader } from '@/components/common';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthSession } from '@/services/auth';
import { getInitials } from '@/utils/formatters';

const ADMIN_PERMISSIONS = [
  'Access analytics dashboard',
  'Manage candidate profiles',
  'Post and manage job listings',
  'View and filter all applications'
];

export const AdminProfilePage = () => {
  const { user } = useAuthSession();

  if (!user) {
    return null;
  }

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader description='Your account information' title='Admin Profile' />

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <Avatar className='size-16'>
                <AvatarFallback className='bg-primary text-xl text-primary-foreground'>
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className='text-lg font-bold'>
                  {user.firstName} {user.lastName}
                </h2>

                <Badge className='mt-1' variant='secondary'>
                  Administrator
                </Badge>
              </div>
            </div>

            <div className='mt-5 flex items-center gap-2.5 text-sm text-muted-foreground'>
              <Mail aria-hidden='true' className='size-4 shrink-0' />

              <span>{user.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Admin Permissions</CardTitle>
          </CardHeader>

          <CardContent>
            <ul className='space-y-2 text-sm'>
              {ADMIN_PERMISSIONS.map((permission) => (
                <li key={permission} className='flex items-center gap-2'>
                  <Building2 aria-hidden='true' className='size-4 shrink-0 text-tertiary' />

                  {permission}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <ChangePassword />
      </div>
    </div>
  );
};
