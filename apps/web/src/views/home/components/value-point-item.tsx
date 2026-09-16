import { CheckCircle2 } from 'lucide-react';

interface ValuePointItemProps {
  text: string;
}

export const ValuePointItem = ({ text }: ValuePointItemProps) => (
  <li className='flex items-start gap-3 text-sm sm:text-base'>
    <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-tertiary'>
      <CheckCircle2 className='h-4 w-4' />
    </div>

    <span className='font-medium text-foreground'>{text}</span>
  </li>
);
