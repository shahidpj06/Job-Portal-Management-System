import { useMemo } from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { IJobData } from '@/types';

interface JobDetailsContentProps {
  job: IJobData;
}

export const JobDetailsContent = (props: JobDetailsContentProps) => {
  const listSections = useMemo(() => {
    return [
      {
        title: 'Key Responsibilities',
        items: props.job.responsibilities,
        icon: ChevronRight,
        iconClassName: 'text-primary'
      },
      {
        title: 'Requirements',
        items: props.job.requirements,
        icon: CheckCircle,
        iconClassName: 'text-tertiary'
      }
    ];
  }, [props.job.responsibilities, props.job.requirements]);

  const tagSections = useMemo(() => {
    return [
      { title: 'Benefits', items: props.job.benefits },
      { title: 'Skills', items: props.job.skills }
    ];
  }, [props.job.benefits, props.job.skills]);

  return (
    <Card>
      <CardContent className='p-6'>
        <h2 className='mb-3 text-lg font-semibold'>About the Role</h2>

        {props.job.summary && (
          <p className='mb-4 whitespace-pre-line text-sm font-medium leading-relaxed'>
            {props.job.summary}
          </p>
        )}

        <p className='whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground'>
          {props.job.description}
        </p>

        {listSections.map((section) => {
          if (section.items.length === 0) {
            return null;
          }

          const Icon = section.icon;

          return (
            <section key={section.title} className='mt-6'>
              <h3 className='mb-3 font-semibold'>{section.title}</h3>

              <ul className='space-y-2'>
                {section.items.map((item, index) => (
                  <li
                    key={`${index}-${item}`}
                    className='flex items-start gap-2 text-sm text-muted-foreground'
                  >
                    <Icon
                      aria-hidden='true'
                      className={`mt-0.5 size-4 shrink-0 ${section.iconClassName}`}
                    />
                    <span className='whitespace-pre-line break-words'>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {tagSections.map((section) => {
          if (section.items.length === 0) {
            return null;
          }

          return (
            <section key={section.title} className='mt-6'>
              <h3 className='mb-3 font-semibold'>{section.title}</h3>

              <div className='flex flex-wrap gap-2'>
                {section.items.map((item, index) => (
                  <Badge
                    key={`${index}-${item}`}
                    variant='secondary'
                    className='h-auto max-w-full whitespace-normal break-words bg-primary/10 text-foreground'
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
};
