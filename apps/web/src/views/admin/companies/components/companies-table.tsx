import { memo } from 'react';

import { CompanyLogo } from '@/components/avatar/company-avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { ICompany } from '@/types';

interface CompaniesTableProps {
  companies: ICompany[];
  onEdit: (company: ICompany) => void;
  onDelete: (company: ICompany) => void;
}

export const CompaniesTable = memo((props: CompaniesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Website</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {props.companies.map((company) => (
          <TableRow key={company.id}>
            <TableCell>
              <div className='flex items-center gap-3'>
                <CompanyLogo
                  name={company.name}
                  logoUrl={company.logoUrl}
                  className='size-10 shrink-0'
                />

                <div className='min-w-0'>
                  <p className='font-medium'>{company.name}</p>
                  <p className='max-w-sm truncate text-sm text-muted-foreground'>
                    {company.description || 'No description'}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className='text-muted-foreground'>
              {company.websiteUrl || 'Not provided'}
            </TableCell>

            <TableCell>
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => props.onEdit(company)}
                  aria-label={`Edit ${company.name}`}
                >
                  Edit
                </Button>

                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='text-destructive hover:text-destructive'
                  onClick={() => props.onDelete(company)}
                  aria-label={`Delete ${company.name}`}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

CompaniesTable.displayName = 'CompaniesTable';
