import { Link } from 'react-router-dom';
import {
  Code2,
  Palette,
  Layers,
  Megaphone,
  TrendingUp,
  Settings2,
  Briefcase,
  type LucideIcon
} from 'lucide-react';
import type { JobCategory } from '@/types';
import { PATHS } from '@/utils/paths';

interface CategoryCardProps {
  category: JobCategory;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Palette,
  Layers,
  Megaphone,
  TrendingUp,
  Settings2,
  Briefcase
};

export function CategoryCard({ category, className = '' }: CategoryCardProps) {
  const IconComponent = (category.icon && ICON_MAP[category.icon]) || Briefcase;

  return (
    <Link
      to={`${PATHS.JOBS}?categoryId=${category.id}`}
      className={`group relative flex flex-col items-center text-center rounded-2xl border border-border/80 bg-surface p-5 md:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_20px_-4px_rgba(79,70,229,0.12)] ${className}`}
    >
      {/* Icon Pill */}
      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 mb-4'>
        <IconComponent className='h-6 w-6' />
      </div>

      {/* Category Name */}
      <h3 className='font-bold text-foreground text-base tracking-tight transition-colors group-hover:text-primary'>
        {category.name}
      </h3>

      {/* Job Count / Subtitle */}
      {category.jobCount !== undefined && (
        <span className='mt-1 text-xs font-medium text-muted-foreground'>
          {category.jobCount.toLocaleString()}+ jobs
        </span>
      )}
      {category.description && (
        <p className='mt-1 text-xs text-muted-foreground/80 line-clamp-1 hidden sm:block'>
          {category.description}
        </p>
      )}
    </Link>
  );
}
