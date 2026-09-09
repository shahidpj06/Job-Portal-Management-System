import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/utils/paths";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-8xl font-black text-primary/20">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
      <Button className="mt-6" asChild>
        <Link to={PATHS.HOME}>Go Home</Link>
      </Button>
    </div>
  );
}
