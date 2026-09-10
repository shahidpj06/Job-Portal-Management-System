import { Outlet } from 'react-router-dom';
import { PublicHeader, Footer } from '@/components/layout';

export const PublicLayout = () => {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <PublicHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
