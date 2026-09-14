interface IFieldErrorProps {
  id: string;
  message?: string;
}

export const FieldError = ({ id, message }: IFieldErrorProps) => {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role='alert' className='text-sm text-destructive'>
      {message}
    </p>
  );
};
