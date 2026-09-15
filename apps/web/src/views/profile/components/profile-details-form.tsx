import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Field, SimpleForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IProfileData, IUpdateProfileRequest } from '@/types';
import {
  getFormValues,
  parseSkills,
  profileFormSchema,
  type ProfileFormValues
} from './profile-helper';

interface IProfileDetailsFormProps {
  profile: IProfileData;
  onSave: (data: IUpdateProfileRequest) => Promise<IProfileData>;
}

export const ProfileDetailsForm = (props: IProfileDetailsFormProps) => {
  const { profile, onSave } = props;
  const defaultValues = useMemo(() => getFormValues(profile), [profile]);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues
  });

  const {
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty }
  } = methods;

  const onSubmit = useCallback(
    async (values: ProfileFormValues) => {
      clearErrors('root');

      try {
        const updatedProfile = await onSave({
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone || null,
          location: values.location || null,
          headline: values.headline || null,
          bio: values.bio || null,
          skills: parseSkills(values.skillsText)
        });

        reset(getFormValues(updatedProfile));
      } catch (error) {
        setError('root', {
          message: error instanceof Error ? error.message : 'Unable to update your profile.'
        });
      }
    },
    [clearErrors, onSave, reset, setError]
  );

  const onReset = useCallback(() => {
    reset(getFormValues(profile));
  }, [profile, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Profile Details</CardTitle>
      </CardHeader>

      <CardContent>
        <SimpleForm methods={methods} onSubmit={onSubmit}>
          <fieldset disabled={isSubmitting} className='min-w-0 space-y-5'>
            <div className='grid gap-5 sm:grid-cols-2'>
              <Field.Text<ProfileFormValues>
                name='firstName'
                label='First name'
                autoComplete='given-name'
                required
              />

              <Field.Text<ProfileFormValues>
                name='lastName'
                label='Last name'
                autoComplete='family-name'
                required
              />
            </div>

            <Field.Text<ProfileFormValues>
              name='email'
              label='Email address'
              type='email'
              readOnly
              helperText='Email changes are not available. This address remains linked to your account.'
            />

            <div className='grid gap-5 sm:grid-cols-2'>
              <Field.Text<ProfileFormValues>
                name='phone'
                label='Phone'
                type='tel'
                autoComplete='tel'
              />

              <Field.Text<ProfileFormValues>
                name='location'
                label='Location'
                placeholder='City, Country'
              />
            </div>

            <Field.Text<ProfileFormValues>
              name='headline'
              label='Profile headline'
              placeholder='e.g. Frontend Developer'
              maxLength={150}
            />

            <Field.Textarea<ProfileFormValues>
              name='bio'
              label='About'
              rows={6}
              maxLength={5000}
              placeholder='Tell employers about your experience and interests.'
            />

            <Field.Textarea<ProfileFormValues>
              name='skillsText'
              label='Core skills'
              rows={3}
              helperText='Separate skills with commas. Maximum 30 skills.'
              placeholder='React, TypeScript, Node.js'
            />

            {errors.root?.message && (
              <p role='alert' className='text-sm text-destructive'>
                {errors.root.message}
              </p>
            )}

            <div className='flex flex-wrap justify-end gap-3'>
              <Button
                type='button'
                variant='outline'
                disabled={!isDirty || isSubmitting}
                onClick={onReset}
              >
                Discard changes
              </Button>

              <Button type='submit' disabled={!isDirty || isSubmitting}>
                {isSubmitting && (
                  <LoaderCircle aria-hidden='true' className='size-4 animate-spin' />
                )}
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </fieldset>
        </SimpleForm>
      </CardContent>
    </Card>
  );
};
