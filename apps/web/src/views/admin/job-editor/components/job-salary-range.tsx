import { useFormContext } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { JobEditorFormData } from '@/schemas/job-editor-schema';

const CURRENCY_CODE_LENGTH = 3;
const MINIMUM_SALARY = 0;
const SALARY_STEP = 1_000;

export const JobSalaryRange = () => {
  const {
    formState: { errors },
    register
  } = useFormContext<JobEditorFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Salary Range</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='grid gap-4 sm:grid-cols-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='salary-currency'>Currency</Label>

            <Input
              id='salary-currency'
              maxLength={CURRENCY_CODE_LENGTH}
              placeholder='INR'
              {...register('currency')}
            />

            {errors.currency && (
              <p className='text-xs text-destructive'>{errors.currency.message}</p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='salary-min'>Minimum</Label>

            <Input
              id='salary-min'
              min={MINIMUM_SALARY}
              step={SALARY_STEP}
              type='number'
              {...register('salaryMin', {
                valueAsNumber: true
              })}
            />

            {errors.salaryMin && (
              <p className='text-xs text-destructive'>{errors.salaryMin.message}</p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='salary-max'>Maximum</Label>

            <Input
              id='salary-max'
              min={MINIMUM_SALARY}
              step={SALARY_STEP}
              type='number'
              {...register('salaryMax', {
                valueAsNumber: true
              })}
            />

            {errors.salaryMax && (
              <p className='text-xs text-destructive'>{errors.salaryMax.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
