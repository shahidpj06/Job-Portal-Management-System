import { Building2, Mail } from 'lucide-react';

import { PageHeader } from '@/components/common';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthSession } from '@/services/auth';
import { getInitials } from '@/utils/formatters';

export function AdminProfilePage() {
  const { user } = useAuthSession();

  if (!user) {
    return null;
  }

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader title='Admin Profile' description='Your account information' />

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16'>
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
              <Mail className='h-4 w-4 shrink-0' />
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
              {[
                'Post and manage job listings',
                'View and filter all applications',
                'Access analytics dashboard',
                'Manage candidate profiles'
              ].map((permission) => (
                <li key={permission} className='flex items-center gap-2'>
                  <Building2 className='h-4 w-4 shrink-0 text-tertiary' />
                  {permission}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
