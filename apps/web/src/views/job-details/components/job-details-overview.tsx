import { useMemo } from 'react';
import { Briefcase, Globe, MapPin, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { IJobData } from '@/types';
import { formatEmploymentType, formatExperience, formatWorkMode } from '@/utils/formatters';

interface JobDetailsOverviewProps {
  job: IJobData;
}

export const JobDetailsOverview = (props: JobDetailsOverviewProps) => {
  const items = useMemo(() => {
    return [
      {
        icon: Briefcase,
        label: 'Type',
        value: formatEmploymentType(props.job.employmentType)
      },
      {
        icon: Globe,
        label: 'Work Mode',
        value: formatWorkMode(props.job.workMode)
      },
      {
        icon: MapPin,
        label: 'Location',
        value: props.job.location
      },
      {
        icon: Users,
        label: 'Experience',
        value: formatExperience(props.job.experienceLevel)
      },
      {
        icon: Users,
        label: 'Applicants',
        value: `${props.job.applicationCount.toLocaleString()} applied`
      }
    ];
  }, [
    props.job.employmentType,
    props.job.workMode,
    props.job.location,
    props.job.experienceLevel,
    props.job.applicationCount
  ]);

  return (
    <Card>
      <CardContent className='space-y-3 p-5'>
        <h2 className='font-semibold'>Job Overview</h2>

        <dl className='space-y-3'>
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className='flex items-start gap-3 text-sm'>
              <Icon aria-hidden='true' className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
              <dt className='shrink-0 text-muted-foreground'>{label}:</dt>
              <dd className='min-w-0 break-words font-medium'>{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};
