import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Field } from '@/components/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IProfileFile } from '@/types';

interface IProfileFilesFormProps {
  files: IProfileFile[];
  onUploadResume: (file: File) => Promise<IProfileFile>;
}

interface IProfileFilesValues {
  resume: IProfileFile | null;
}

export const ProfileFilesForm = (props: IProfileFilesFormProps) => {
  const { files, onUploadResume } = props;

  const values = useMemo<IProfileFilesValues>(
    () => ({
      resume: files.find((file) => file.kind === 'RESUME') ?? null
    }),
    [files]
  );

  const methods = useForm<IProfileFilesValues>({ values });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Resume</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Your resume saves immediately after upload. A failed upload will not replace your existing
          file.
        </p>
      </CardHeader>

      <CardContent>
        <FormProvider {...methods}>
          <Field.Upload<IProfileFilesValues>
            name='resume'
            label='Resume file'
            accept='application/pdf'
            maxBytes={5 * 1024 * 1024}
            helperText='PDF only. Maximum 5 MB. Stored privately.'
            onUpload={onUploadResume}
          />
        </FormProvider>
      </CardContent>
    </Card>
  );
};
