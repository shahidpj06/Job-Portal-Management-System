import { Outlet } from 'react-router-dom';

import { RouteGuard } from '../guards/route-guard';
import { AdminSidebar, AdminTopbar } from '@/components/layout';

export const AdminLayout = () => {
  return (
    <RouteGuard allowedRoles={['ADMIN']}>
      <div className='flex h-screen overflow-hidden bg-background'>
        <AdminSidebar />

        <div className='flex flex-1 flex-col overflow-hidden'>
          <AdminTopbar />

          <main className='flex-1 overflow-y-auto'>
            <Outlet />
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
