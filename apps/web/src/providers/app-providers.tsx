import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { AuthSessionProvider } from '@/providers/auth-session-provider';
import { store } from '@/services/store';

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={store}>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </Provider>
  );
};
