import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { ResultsPagination } from '@/components/pagination/pagination';
import { SearchInput } from '@/components/search/search-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useDebouncedValue } from '@/hooks';
import { getApiErrorMessage } from '@/services/api/get-api-error-message';
import { useAuthSession } from '@/services/auth';
import {
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useListAdminCompaniesQuery,
  useUpdateCompanyMutation
} from '@/services/company';
import type { ICompany, ICreateCompanyRequest } from '@/types';

import { CompaniesTable } from './components/companies-table';
import { CompanyFormDialog } from './components/company-form-dialog';

const PAGE_SIZE = 10;

interface CompanyEditorState {
  company?: ICompany;
}

export const AdminCompaniesPage = () => {
  const { user, isAuthenticated } = useAuthSession();
  const canManage = isAuthenticated && user?.role === 'ADMIN';

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [editor, setEditor] = useState<CompanyEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ICompany | null>(null);
  const [saveError, setSaveError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const debouncedSearch = useDebouncedValue(searchInput);
  const isSearchPending = searchInput !== debouncedSearch;

  const queryArguments = useMemo(
    () =>
      canManage
        ? {
            page,
            limit: PAGE_SIZE,
            search: debouncedSearch.trim() || undefined
          }
        : skipToken,
    [canManage, page, debouncedSearch]
  );

  const {
    currentData: response,
    isFetching,
    isError,
    error,
    refetch
  } = useListAdminCompaniesQuery(queryArguments, {
    refetchOnMountOrArgChange: true
  });

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

  const isSaving = isCreating || isUpdating;
  const companies = response?.data.items ?? [];
  const pagination = response?.data.pagination;

  const onSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setPage(1);
  }, []);

  const onClearSearch = useCallback(() => {
    setSearchInput('');
    setPage(1);
  }, []);

  const onFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const onRetry = useCallback(() => {
    if (canManage) {
      void refetch();
    }
  }, [canManage, refetch]);

  const onCreate = useCallback(() => {
    setSaveError('');
    setEditor({});
  }, []);

  const onEdit = useCallback((company: ICompany) => {
    setSaveError('');
    setEditor({ company });
  }, []);

  const onCloseEditor = useCallback(() => {
    if (!isSaving) {
      setEditor(null);
      setSaveError('');
    }
  }, [isSaving]);

  const onSave = useCallback(
    async (data: ICreateCompanyRequest) => {
      if (!canManage || !editor || isSaving) {
        return;
      }

      setSaveError('');

      try {
        if (editor.company) {
          await updateCompany({
            companyId: editor.company.id,
            data
          }).unwrap();
        } else {
          await createCompany(data).unwrap();
        }

        toast.success(editor.company ? 'Company updated.' : 'Company created.');
        setEditor(null);
      } catch (requestError) {
        setSaveError(getApiErrorMessage(requestError));
      }
    },
    [canManage, editor, isSaving, createCompany, updateCompany]
  );

  const onRequestDelete = useCallback((company: ICompany) => {
    setDeleteError('');
    setDeleteTarget(company);
  }, []);

  const onCloseDelete = useCallback(() => {
    if (!isDeleting) {
      setDeleteTarget(null);
      setDeleteError('');
    }
  }, [isDeleting]);

  const onDeleteOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onCloseDelete();
      }
    },
    [onCloseDelete]
  );

  const onConfirmDelete = useCallback(async () => {
    if (!canManage || !deleteTarget || isDeleting) {
      return;
    }

    setDeleteError('');

    try {
      await deleteCompany(deleteTarget.id).unwrap();
      toast.success('Company deleted.');
      setDeleteTarget(null);

      if (companies.length === 1 && page > 1) {
        setPage((previous) => Math.max(1, previous - 1));
      }
    } catch (requestError) {
      setDeleteError(getApiErrorMessage(requestError));
    }
  }, [canManage, deleteTarget, isDeleting, deleteCompany, companies.length, page]);

  if (!canManage) {
    return <LoadingState />;
  }

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader
        title='Companies'
        description='Manage the companies associated with job listings.'
        actions={
          <Button type='button' onClick={onCreate}>
            <Plus aria-hidden='true' className='mr-2 size-4' />
            Add company
          </Button>
        }
      />

      <Card>
        <CardContent className='space-y-4 p-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <SearchInput
              value={searchInput}
              onValueChange={onSearchChange}
              placeholder='Search companies'
              aria-label='Search companies by name'
              maxLength={100}
              wrapperClassName='w-full sm:max-w-sm'
            />

            {searchInput && (
              <Button type='button' variant='ghost' onClick={onClearSearch}>
                Clear search
              </Button>
            )}
          </div>

          {isFetching || isSearchPending ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState description={getApiErrorMessage(error)} onRetry={onRetry} />
          ) : companies.length > 0 ? (
            <>
              <CompaniesTable companies={companies} onEdit={onEdit} onDelete={onRequestDelete} />

              {pagination && (
                <ResultsPagination
                  page={pagination.page}
                  pageCount={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemLabel='companies'
                  onPageChange={setPage}
                />
              )}
            </>
          ) : (
            <EmptyState
              title='No companies found'
              description={
                searchInput
                  ? 'Try a different company name.'
                  : 'Add a company to use it in job listings.'
              }
              action={
                page > 1 ? (
                  <Button type='button' variant='outline' onClick={onFirstPage}>
                    Go to first page
                  </Button>
                ) : undefined
              }
            />
          )}
        </CardContent>
      </Card>

      {editor && (
        <CompanyFormDialog
          key={editor.company?.id ?? 'create'}
          company={editor.company}
          isSaving={isSaving}
          errorMessage={saveError}
          onClose={onCloseEditor}
          onSave={onSave}
        />
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={onDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete company?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {deleteTarget?.name}? This cannot be undone. Companies linked to jobs cannot be
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p role='alert' className='text-sm text-destructive'>
              {deleteError}
            </p>
          )}

          <AlertDialogFooter>
            <Button type='button' variant='outline' disabled={isDeleting} onClick={onCloseDelete}>
              Cancel
            </Button>

            <Button
              type='button'
              variant='destructive'
              disabled={isDeleting}
              onClick={onConfirmDelete}
            >
              {isDeleting ? 'Deleting…' : 'Delete company'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
