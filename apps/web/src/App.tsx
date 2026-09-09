import { RouterProvider } from "react-router-dom";
import { MockSessionProvider } from "@/providers/mock-session-provider";
import { router } from "@/app/router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <MockSessionProvider>
      <RouterProvider router={router} />
      <Toaster />
    </MockSessionProvider>
  );
}

export default App;
