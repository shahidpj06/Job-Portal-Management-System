import { Briefcase, Globe, MapPin, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { IJobData } from '@/types';
import { formatEmploymentType, formatExperience, formatWorkMode } from '@/utils/formatters';

interface JobDetailsOverviewProps {
  job: IJobData;
}

export const JobDetailsOverview = ({ job }: JobDetailsOverviewProps) => {
  const overviewItems = [
    {
      icon: Users,
      label: 'Applicants',
      value: `${job.applicationCount.toLocaleString()} applied`
    },
    {
      icon: Users,
      label: 'Experience',
      value: formatExperience(job.experienceLevel)
    },
    {
      icon: MapPin,
      label: 'Location',
      value: job.location
    },
    {
      icon: Briefcase,
      label: 'Type',
      value: formatEmploymentType(job.employmentType)
    },
    {
      icon: Globe,
      label: 'Work Mode',
      value: formatWorkMode(job.workMode)
    }
  ];

  return (
    <Card>
      <CardContent className='space-y-3 p-5'>
        <h2 className='font-semibold'>Job Overview</h2>

        <dl className='space-y-3'>
          {overviewItems.map(({ icon: OverviewIcon, label, value }) => (
            <div key={label} className='flex items-start gap-3 text-sm'>
              <OverviewIcon
                aria-hidden='true'
                className='mt-0.5 size-4 shrink-0 text-muted-foreground'
              />

              <dt className='shrink-0 text-muted-foreground'>{label}:</dt>

              <dd className='min-w-0 break-words font-medium'>{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};
