import { memo, useCallback, type ChangeEvent, type ComponentProps } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface ISearchInputProps extends Omit<
  ComponentProps<typeof Input>,
  'onChange' | 'type' | 'value'
> {
  onValueChange: (value: string) => void;
  value: string;
  wrapperClassName?: string;
}

const SearchInputComponent = ({
  className,
  onValueChange,
  value,
  wrapperClassName,
  ...inputProps
}: ISearchInputProps) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onValueChange(event.target.value);
    },
    [onValueChange]
  );

  return (
    <div className={cn('relative', wrapperClassName)}>
      <Search
        aria-hidden='true'
        className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
      />

      <Input
        {...inputProps}
        type='search'
        value={value}
        onChange={handleChange}
        className={cn('pl-9', className)}
        aria-label={inputProps['aria-label'] ?? 'Search'}
      />
    </div>
  );
};

export const SearchInput = memo(SearchInputComponent);
