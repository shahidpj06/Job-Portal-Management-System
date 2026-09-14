import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { paths } from "@/utils/paths";
import { APP_CONFIG } from "@/utils/global-config";

const schema = z.object({ email: z.string().email("Please enter a valid email") });
type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(_data: FormData) {
    await new Promise((r) => setTimeout(r, 800));
  }

  return (
    <div className="flex min-h-[calc(90vh-4rem)] flex-col items-center justify-center px-4 py-12 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to={paths.home} className="mx-auto mb-4 flex w-fit items-center gap-2 text-lg font-bold text-primary">
            <Briefcase className="h-6 w-6" />
            {APP_CONFIG.name}
          </Link>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitSuccessful ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-center text-sm text-emerald-700">
              ✅ Check your email for a reset link. It may take a few minutes.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="fp-email">Email address</Label>
                <Input id="fp-email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send Reset Link"}
              </Button>
            </form>
          )}
          <div className="mt-5 text-center">
            <Link to={paths.auth.login} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
