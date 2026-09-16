import { type PropsWithChildren, type ReactNode } from 'react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_CONFIG } from '@/utils/global-config';
import { paths } from '@/utils/paths';

export interface IAuthPageCardProps extends PropsWithChildren {
  description: ReactNode;
  footer?: ReactNode;
  title: string;
}

export const AuthPageCard = ({ children, description, footer, title }: IAuthPageCardProps) => {
  return (
    <main className='flex min-h-[calc(90vh-4rem)] flex-col items-center justify-center px-4 py-12 bg-muted/30'>
      <Card className='w-full max-w-md shadow-lg border-border/50'>
        <CardHeader className='text-center'>
          <Link
            aria-label={`${APP_CONFIG.name} home`}
            className='mx-auto mb-4 flex w-fit items-center gap-2 text-lg font-bold text-primary'
            to={paths.home}
          >
            <Briefcase className='h-6 w-6 text-primary' />
            {APP_CONFIG.name}
          </Link>

          <CardTitle className='text-2xl font-bold tracking-tight'>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent>
          {children}

          {footer && <div className='mt-5 text-center text-sm text-muted-foreground'>{footer}</div>}
        </CardContent>
      </Card>
    </main>
  );
};
