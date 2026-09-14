import { useMemo } from 'react';
import { Globe } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { ICompany } from '@/types/company';

interface CompanyDetailsCardProps {
  company: ICompany;
}

export const CompanyDetailsCard = (props: CompanyDetailsCardProps) => {
  const websiteUrl = useMemo(() => {
    if (!props.company.websiteUrl) {
      return undefined;
    }

    try {
      const url = new URL(props.company.websiteUrl);

      return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
    } catch {
      return undefined;
    }
  }, [props.company.websiteUrl]);

  return (
    <Card>
      <CardContent className='p-5'>
        <h2 className='mb-3 font-semibold'>About {props.company.name}</h2>

        <p className='whitespace-pre-line text-sm leading-relaxed text-muted-foreground'>
          {props.company.description?.trim() || 'Company information has not been provided.'}
        </p>

        {websiteUrl && (
          <a
            href={websiteUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline'
          >
            <Globe aria-hidden='true' className='size-4' />
            Visit website
          </a>
        )}
      </CardContent>
    </Card>
  );
};
