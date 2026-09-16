import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';

import { CategoryCard } from '@/components/jobs';
import { Button } from '@/components/ui/button';
import { paths } from '@/utils/paths';
import { SectionHeading } from './section-heading';


type Category = ComponentProps<typeof CategoryCard>['category'];

interface CategoriesSectionProps {
  categories: Category[];
}

export const CategoriesSection = ({ categories }: CategoriesSectionProps) => (
  <section className='px-4 py-16 md:py-20'>
    <div className='mx-auto max-w-[1200px]'>
      <SectionHeading
        eyebrow='Explore specializations'
        title='Browse by Category'
        description='Find opportunities in your field'
        action={
          <Button
            variant='outline'
            size='sm'
            asChild
            className='self-start rounded-xl border-border font-semibold hover:bg-muted sm:self-auto'
          >
            <Link to={paths.jobs}>View all</Link>
          </Button>
        }
      />

      <div className='grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6'>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  </section>
);
