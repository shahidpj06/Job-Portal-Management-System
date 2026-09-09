import { Outlet } from "react-router-dom";
import { AdminSidebar, AdminTopbar } from "@/components/layout";
import { useMockSession } from "@/providers/mock-session-provider";
import { LoginPage } from "@/views/auth/login-page";

export function AdminLayout() {
  const { isAuthenticated, isAdmin } = useMockSession();

  // Guard: only admin users can access this layout
  if (!isAuthenticated || !isAdmin) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
