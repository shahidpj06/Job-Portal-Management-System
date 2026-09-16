import { CheckCircle, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { IJobData } from '@/types';

interface JobDetailsContentProps {
  job: IJobData;
}

interface JobDetailsListSectionProps {
  icon: typeof CheckCircle;
  iconClassName: string;
  items: string[];
  title: string;
}

interface JobDetailsTagSectionProps {
  items: string[];
  title: string;
}

const JobDetailsListSection = ({
  icon: ListItemIcon,
  iconClassName,
  items,
  title
}: JobDetailsListSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className='mt-6'>
      <h3 className='mb-3 font-semibold'>{title}</h3>

      <ul className='space-y-2'>
        {items.map((item) => (
          <li
            key={`${title}-${item}`}
            className='flex items-start gap-2 text-sm text-muted-foreground'
          >
            <ListItemIcon
              aria-hidden='true'
              className={`mt-0.5 size-4 shrink-0 ${iconClassName}`}
            />

            <span className='whitespace-pre-line break-words'>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const JobDetailsTagSection = ({ items, title }: JobDetailsTagSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className='mt-6'>
      <h3 className='mb-3 font-semibold'>{title}</h3>

      <div className='flex flex-wrap gap-2'>
        {items.map((item) => (
          <Badge
            key={`${title}-${item}`}
            className='h-auto max-w-full whitespace-normal break-words bg-primary/10 text-foreground'
            variant='secondary'
          >
            {item}
          </Badge>
        ))}
      </div>
    </section>
  );
};

export const JobDetailsContent = ({ job }: JobDetailsContentProps) => (
  <Card>
    <CardContent className='p-6'>
      <h2 className='mb-3 text-lg font-semibold'>About the Role</h2>

      {job.summary && (
        <p className='mb-4 whitespace-pre-line text-sm font-medium leading-relaxed'>
          {job.summary}
        </p>
      )}

      <p className='whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground'>
        {job.description}
      </p>

      <JobDetailsTagSection items={job.benefits} title='Benefits' />

      <JobDetailsListSection
        icon={ChevronRight}
        iconClassName='text-primary'
        items={job.responsibilities}
        title='Key Responsibilities'
      />

      <JobDetailsListSection
        icon={CheckCircle}
        iconClassName='text-tertiary'
        items={job.requirements}
        title='Requirements'
      />

      <JobDetailsTagSection items={job.skills} title='Skills' />
    </CardContent>
  </Card>
);
