import { skipToken } from '@reduxjs/toolkit/query';
import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { ResultsPagination } from '@/components/pagination/pagination';
import { SearchInput } from '@/components/search/search-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { ConfirmActionDialog } from '@/components/dialog/confirm-action-dialog';

const ADMIN_ROLE = 'ADMIN';
const DEFAULT_PAGE = 1;
const MAXIMUM_SEARCH_LENGTH = 100;
const PAGE_SIZE = 10;

interface CompanyEditorState {
  company?: ICompany;
}

export const AdminCompaniesPage = () => {
  const { isAuthenticated, user } = useAuthSession();
  const [companyEditor, setCompanyEditor] = useState<CompanyEditorState | null>(null);
  const [companyPendingDeletion, setCompanyPendingDeletion] = useState<ICompany | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput);
  const isSearchPending = searchInput !== debouncedSearch;
  const canManageCompanies = isAuthenticated && user?.role === ADMIN_ROLE;

  const queryArguments = useMemo(
    () =>
      canManageCompanies
        ? {
            limit: PAGE_SIZE,
            page,
            search: debouncedSearch.trim() || undefined
          }
        : skipToken,
    [canManageCompanies, debouncedSearch, page]
  );

  const {
    currentData: companiesResponse,
    error,
    isError,
    isFetching,
    refetch
  } = useListAdminCompaniesQuery(queryArguments, {
    refetchOnMountOrArgChange: true
  });

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const companies = companiesResponse?.data.items ?? [];
  const pagination = companiesResponse?.data.pagination;
  const isSaving = isCreating || isUpdating;

  const errorMessage = useMemo(
    () => (isError ? getApiErrorMessage(error) : undefined),
    [error, isError]
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setPage(DEFAULT_PAGE);
  }, []);

  const handleCloseCompanyEditor = useCallback(() => {
    if (!isSaving) {
      setCompanyEditor(null);
      setSaveErrorMessage('');
    }
  }, [isSaving]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setCompanyPendingDeletion(null);
      setDeleteErrorMessage('');
    }
  }, [isDeleting]);

  const handleCompanyCreate = useCallback(() => {
    setSaveErrorMessage('');
    setCompanyEditor({});
  }, []);

  const handleCompanyDeleteRequest = useCallback((company: ICompany) => {
    setDeleteErrorMessage('');
    setCompanyPendingDeletion(company);
  }, []);

  const handleCompanyEdit = useCallback((company: ICompany) => {
    setSaveErrorMessage('');
    setCompanyEditor({
      company
    });
  }, []);

  const handleCompanySave = useCallback(
    async (companyRequest: ICreateCompanyRequest) => {
      if (!canManageCompanies || !companyEditor || isSaving) {
        return;
      }

      setSaveErrorMessage('');

      try {
        if (companyEditor.company) {
          await updateCompany({
            companyId: companyEditor.company.id,
            data: companyRequest
          }).unwrap();

          toast.success('Company updated.');
        } else {
          await createCompany(companyRequest).unwrap();

          toast.success('Company created.');
        }

        setCompanyEditor(null);
      } catch (requestError) {
        setSaveErrorMessage(getApiErrorMessage(requestError));
      }
    },
    [canManageCompanies, companyEditor, createCompany, isSaving, updateCompany]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!canManageCompanies || !companyPendingDeletion || isDeleting) {
      return;
    }

    setDeleteErrorMessage('');
    try {
      await deleteCompany(companyPendingDeletion.id).unwrap();

      toast.success('Company deleted.');
      setCompanyPendingDeletion(null);

      if (companies.length === 1 && page > DEFAULT_PAGE) {
        setPage((currentPage) => Math.max(DEFAULT_PAGE, currentPage - 1));
      }
    } catch (requestError) {
      setDeleteErrorMessage(getApiErrorMessage(requestError));
    }
  }, [
    canManageCompanies,
    companies.length,
    companyPendingDeletion,
    deleteCompany,
    isDeleting,
    page
  ]);

  const handleFirstPage = useCallback(() => {
    setPage(DEFAULT_PAGE);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleRetry = useCallback(() => {
    if (canManageCompanies) {
      void refetch();
    }
  }, [canManageCompanies, refetch]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  }, []);

  if (!canManageCompanies) {
    return <LoadingState />;
  }

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader
        actions={
          <Button onClick={handleCompanyCreate} type='button'>
            <Plus aria-hidden='true' className='mr-2 size-4' />
            Add company
          </Button>
        }
        description='Manage the companies associated with job listings.'
        title='Companies'
      />

      <Card>
        <CardContent className='space-y-4 p-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <SearchInput
              aria-label='Search companies by name'
              maxLength={MAXIMUM_SEARCH_LENGTH}
              onValueChange={handleSearchChange}
              placeholder='Search companies'
              value={searchInput}
              wrapperClassName='w-full sm:max-w-sm'
            />

            {searchInput && (
              <Button onClick={handleClearSearch} type='button' variant='ghost'>
                Clear search
              </Button>
            )}
          </div>

          {isFetching || isSearchPending ? (
            <LoadingState />
          ) : errorMessage ? (
            <ErrorState description={errorMessage} onRetry={handleRetry} />
          ) : companies.length > 0 ? (
            <>
              <CompaniesTable
                companies={companies}
                onDelete={handleCompanyDeleteRequest}
                onEdit={handleCompanyEdit}
              />

              {pagination && (
                <ResultsPagination
                  itemLabel='companies'
                  onPageChange={handlePageChange}
                  page={pagination.page}
                  pageCount={pagination.totalPages}
                  totalItems={pagination.totalItems}
                />
              )}
            </>
          ) : (
            <EmptyState
              action={
                page > DEFAULT_PAGE ? (
                  <Button onClick={handleFirstPage} type='button' variant='outline'>
                    Go to first page
                  </Button>
                ) : undefined
              }
              description={
                searchInput
                  ? 'Try a different company name.'
                  : 'Add a company to use it in job listings.'
              }
              title='No companies found'
            />
          )}
        </CardContent>
      </Card>

      {companyEditor && (
        <CompanyFormDialog
          key={companyEditor.company?.id ?? 'create'}
          company={companyEditor.company}
          errorMessage={saveErrorMessage}
          isSaving={isSaving}
          onClose={handleCloseCompanyEditor}
          onSave={handleCompanySave}
        />
      )}

      <ConfirmActionDialog
        confirmLabel='Delete company'
        description={
          companyPendingDeletion
            ? `Delete ${companyPendingDeletion.name}? This cannot be undone. Companies linked to jobs cannot be deleted.`
            : ''
        }
        errorMessage={deleteErrorMessage}
        isLoading={isDeleting}
        loadingLabel='Deleting…'
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        open={Boolean(companyPendingDeletion)}
        title='Delete company?'
        variant='destructive'
      />
    </div>
  );
};
