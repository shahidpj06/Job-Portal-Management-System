import { Globe } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { ICompany } from '@/types/company';

const SUPPORTED_WEBSITE_PROTOCOLS = ['http:', 'https:'];

interface CompanyDetailsCardProps {
  company: ICompany;
}

const getValidWebsiteUrl = (websiteUrl?: string | null): string | undefined => {
  if (!websiteUrl) {
    return undefined;
  }

  try {
    const parsedWebsiteUrl = new URL(websiteUrl);

    if (!SUPPORTED_WEBSITE_PROTOCOLS.includes(parsedWebsiteUrl.protocol)) {
      return undefined;
    }

    return parsedWebsiteUrl.href;
  } catch {
    return undefined;
  }
};

export const CompanyDetailsCard = ({ company }: CompanyDetailsCardProps) => {
  const websiteUrl = getValidWebsiteUrl(company.websiteUrl);

  return (
    <Card>
      <CardContent className='p-5'>
        <h2 className='mb-3 font-semibold'>About {company.name}</h2>

        <p className='whitespace-pre-line text-sm leading-relaxed text-muted-foreground'>
          {company.description?.trim() || 'Company information has not been provided.'}
        </p>

        {websiteUrl && (
          <a
            className='mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline'
            href={websiteUrl}
            rel='noopener noreferrer'
            target='_blank'
          >
            <Globe aria-hidden='true' className='size-4' />
            Visit website
          </a>
        )}
      </CardContent>
    </Card>
  );
};
