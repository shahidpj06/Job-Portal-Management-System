import { memo, useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export const CompanyLogo = memo(
  ({ name, logoUrl, className, fallbackClassName }: CompanyLogoProps) => {
    const fallbackText = useMemo(() => {
      const letters = name.match(/\p{L}/gu) ?? [];

      if (letters.length === 0) {
        return '?';
      }

      if (letters.length === 1) {
        return letters[0].toUpperCase();
      }

      return `${letters[0]}${letters[letters.length - 1]}`.toUpperCase();
    }, [name]);

    return (
      <Avatar className={cn('size-12 shrink-0 rounded-xl after:rounded-xl', className)}>
        {logoUrl && (
          <AvatarImage src={logoUrl} alt={`${name} logo`} className='rounded-xl object-contain' />
        )}

        <AvatarFallback
          aria-label={name}
          className={cn(
            'rounded-xl bg-primary/10 text-lg font-bold text-primary',
            fallbackClassName
          )}
        >
          {fallbackText}
        </AvatarFallback>
      </Avatar>
    );
  }
);

CompanyLogo.displayName = 'CompanyLogo';
