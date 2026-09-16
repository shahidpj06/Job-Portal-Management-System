import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/services/api/get-api-error-message';
import { useChangePasswordMutation } from '@/services/auth/auth.api';
import { clearSession } from '@/services/auth/auth.slice';
import { useAuthSession } from '@/services/auth/use-auth-session';
import { useAppDispatch } from '@/services/hooks';
import type { ChangePasswordRequest } from '@/types/auth';
import { paths } from '@/utils/paths';

import { ChangePasswordForm } from './change-password-form';

export const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const [changePassword] = useChangePasswordMutation();

  const onSave = useCallback(
    async (request: ChangePasswordRequest) => {
      try {
        await changePassword(request).unwrap();
      } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error));
      }

      dispatch(clearSession());

      toast.success('Password changed successfully. Please sign in again.');

      navigate(paths.auth.login, { replace: true });
    },
    [changePassword, dispatch, navigate]
  );

  if (!user) {
    return null;
  }

  return <ChangePasswordForm key={user.id} onSave={onSave} />;
};
