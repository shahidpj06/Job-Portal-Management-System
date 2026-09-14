import type { ComponentProps } from 'react';
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn
} from 'react-hook-form';

export interface ISimpleFormProps<TFieldValues extends FieldValues> extends Omit<
  ComponentProps<'form'>,
  'onSubmit'
> {
  methods: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
}

export const SimpleForm = <TFieldValues extends FieldValues>({
  children,
  methods,
  onSubmit,
  ...formProps
}: ISimpleFormProps<TFieldValues>) => {
  return (
    <FormProvider {...methods}>
      <form {...formProps} noValidate onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
};
