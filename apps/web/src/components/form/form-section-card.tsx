import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormSectionCardProps {
  children: ReactNode;
  description?: ReactNode;
  title: ReactNode;
}

export const FormSectionCard = ({ children, description, title }: FormSectionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{title}</CardTitle>

        {description}
      </CardHeader>

      <CardContent className='space-y-4'>{children}</CardContent>
    </Card>
  );
};
