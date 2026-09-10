import { RouterProvider } from "react-router-dom";

import { router } from "@/app/router";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/providers/app-providers";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster />
    </AppProviders>
  );
}

export default App;
