import { useFormContext, useWatch } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type {
  EmploymentType,
  ExperienceLevel,
  JobCategoryCode,
  JobStatus,
  WorkMode
} from '@/types';
import {
  formatEmploymentType,
  formatExperience,
  formatJobStatus,
  formatWorkMode
} from '@/utils/formatters';
import type { JobEditorFormData } from '@/schemas/job-editor-schema';

const CATEGORY_OPTIONS: Array<{
  label: string;
  value: JobCategoryCode;
}> = [
  {
    label: 'Design',
    value: 'DESIGN'
  },
  {
    label: 'Engineering',
    value: 'ENGINEERING'
  },
  {
    label: 'Marketing',
    value: 'MARKETING'
  },
  {
    label: 'Operations',
    value: 'OPERATIONS'
  },
  {
    label: 'Product',
    value: 'PRODUCT'
  },
  {
    label: 'Sales',
    value: 'SALES'
  }
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'CONTRACT',
  'FREELANCE',
  'FULL_TIME',
  'INTERNSHIP',
  'PART_TIME'
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'DIRECTOR',
  'ENTRY_LEVEL',
  'EXECUTIVE',
  'MID_LEVEL',
  'SENIOR_LEVEL'
];

const JOB_STATUSES: JobStatus[] = ['CLOSED', 'DRAFT', 'PUBLISHED'];

const WORK_MODES: WorkMode[] = ['HYBRID', 'ON_SITE', 'REMOTE'];

export const JobDetails = () => {
  const { control, setValue } = useFormContext<JobEditorFormData>();

  const selectedCategory = useWatch({
    control,
    name: 'category'
  });

  const selectedEmploymentType = useWatch({
    control,
    name: 'employmentType'
  });

  const selectedExperienceLevel = useWatch({
    control,
    name: 'experienceLevel'
  });

  const selectedStatus = useWatch({
    control,
    name: 'status'
  });

  const selectedWorkMode = useWatch({
    control,
    name: 'workMode'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Job Details</CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='job-category'>Category *</Label>

          <Select
            items={CATEGORY_OPTIONS}
            onValueChange={(value) => {
              setValue('category', value as JobCategoryCode, {
                shouldValidate: true
              });
            }}
            value={selectedCategory}
          >
            <SelectTrigger className='w-full' id='job-category'>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {CATEGORY_OPTIONS.map((categoryOption) => (
                <SelectItem key={categoryOption.value} value={categoryOption.value}>
                  {categoryOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='employment-type'>Employment type</Label>

          <Select
            onValueChange={(value) => {
              setValue('employmentType', value as EmploymentType);
            }}
            value={selectedEmploymentType}
          >
            <SelectTrigger className='w-full' id='employment-type'>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {EMPLOYMENT_TYPES.map((employmentType) => (
                <SelectItem key={employmentType} value={employmentType}>
                  {formatEmploymentType(employmentType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='experience-level'>Experience level</Label>

          <Select
            onValueChange={(value) => {
              setValue('experienceLevel', value as ExperienceLevel);
            }}
            value={selectedExperienceLevel}
          >
            <SelectTrigger className='w-full' id='experience-level'>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {EXPERIENCE_LEVELS.map((experienceLevel) => (
                <SelectItem key={experienceLevel} value={experienceLevel}>
                  {formatExperience(experienceLevel)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='job-status'>Status</Label>

          <Select
            onValueChange={(value) => {
              setValue('status', value as JobStatus);
            }}
            value={selectedStatus}
          >
            <SelectTrigger className='w-full' id='job-status'>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {JOB_STATUSES.map((jobStatus) => (
                <SelectItem key={jobStatus} value={jobStatus}>
                  {formatJobStatus(jobStatus)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='work-mode'>Work mode</Label>

          <Select
            onValueChange={(value) => {
              setValue('workMode', value as WorkMode);
            }}
            value={selectedWorkMode}
          >
            <SelectTrigger className='w-full' id='work-mode'>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {WORK_MODES.map((workMode) => (
                <SelectItem key={workMode} value={workMode}>
                  {formatWorkMode(workMode)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
