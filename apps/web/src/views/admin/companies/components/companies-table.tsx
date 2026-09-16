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
  onDelete: (company: ICompany) => void;
  onEdit: (company: ICompany) => void;
}

export const CompaniesTable = ({ companies, onDelete, onEdit }: CompaniesTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Company</TableHead>
        <TableHead>Website</TableHead>
        <TableHead className='text-right'>Actions</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {companies.map((company) => (
        <TableRow key={company.id}>
          <TableCell>
            <div className='flex items-center gap-3'>
              <CompanyLogo
                className='size-10 shrink-0'
                logoUrl={company.logoUrl}
                name={company.name}
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
                aria-label={`Edit ${company.name}`}
                onClick={() => {
                  onEdit(company);
                }}
                size='sm'
                type='button'
                variant='outline'
              >
                Edit
              </Button>

              <Button
                aria-label={`Delete ${company.name}`}
                className='text-destructive hover:text-destructive'
                onClick={() => {
                  onDelete(company);
                }}
                size='sm'
                type='button'
                variant='ghost'
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
