import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { JobEditorFormData } from '@/schemas/job-editor-schema';


interface CompanyOption {
  id: string;
  name: string;
}

interface JobBasicInformationProps {
  companies: CompanyOption[];
}

export const JobBasicInformation = ({ companies }: JobBasicInformationProps) => {
  const {
    control,
    formState: { errors },
    register,
    setValue
  } = useFormContext<JobEditorFormData>();

  const selectedCompanyId = useWatch({
    control,
    name: 'companyId'
  });

  const companySelectItems = useMemo(
    () =>
      companies.map((company) => ({
        label: company.name,
        value: company.id
      })),
    [companies]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Basic Information</CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='job-title'>Job title *</Label>

          <Input
            id='job-title'
            placeholder='e.g. Senior Frontend Developer'
            {...register('title')}
          />

          {errors.title && <p className='text-xs text-destructive'>{errors.title.message}</p>}
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='job-company'>Company *</Label>

            <Select
              items={companySelectItems}
              onValueChange={(value) => {
                setValue('companyId', value, {
                  shouldValidate: true
                });
              }}
              value={selectedCompanyId}
            >
              <SelectTrigger className='w-full' id='job-company'>
                <SelectValue placeholder='Select company' />
              </SelectTrigger>

              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.companyId && (
              <p className='text-xs text-destructive'>{errors.companyId.message}</p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='job-location'>Location *</Label>

            <Input
              id='job-location'
              placeholder='Remote / City, Country'
              {...register('location')}
            />

            {errors.location && (
              <p className='text-xs text-destructive'>{errors.location.message}</p>
            )}
          </div>
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='job-summary'>Summary *</Label>

          <Textarea
            id='job-summary'
            placeholder='Provide a concise overview of the role.'
            rows={3}
            {...register('summary')}
          />

          {errors.summary && <p className='text-xs text-destructive'>{errors.summary.message}</p>}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='job-description'>Full description *</Label>

          <Textarea
            id='job-description'
            placeholder='Describe the responsibilities and expectations.'
            rows={7}
            {...register('description')}
          />

          {errors.description && (
            <p className='text-xs text-destructive'>{errors.description.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
