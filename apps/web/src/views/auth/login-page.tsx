import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useAuthSession } from '@/services/auth';
import { getApiErrorMessage } from '@/services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PATHS } from '@/utils/paths';
import { APP_CONFIG } from '@/utils/global-config';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { isLoading, login } = useAuthSession();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      try {
        const user = await login(data);

        toast.success('Welcome back.');

        navigate(user.role === 'ADMIN' ? PATHS.ADMIN.DASHBOARD : PATHS.JOBS, { replace: true });
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Unable to sign in.'));
      }
    },
    [login, navigate]
  );

  return (
    <div className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 bg-muted/30'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <Link
            to={PATHS.HOME}
            className='mx-auto mb-4 flex w-fit items-center gap-2 text-lg font-bold text-primary'
          >
            <Briefcase className='h-6 w-6' />
            {APP_CONFIG.name}
          </Link>
          <CardTitle className='text-2xl'>Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
            <div className='space-y-1.5'>
              <Label htmlFor='login-email'>Email</Label>
              <Input
                id='login-email'
                type='email'
                placeholder='you@example.com'
                autoComplete='email'
                {...register('email')}
              />
              {errors.email && <p className='text-xs text-destructive'>{errors.email.message}</p>}
            </div>

            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='login-password'>Password</Label>
                <Link to={PATHS.FORGOT_PASSWORD} className='text-xs text-primary hover:underline'>
                  Forgot password?
                </Link>
              </div>
              <div className='relative'>
                <Input
                  id='login-password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  autoComplete='current-password'
                  className='pr-10'
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
              {errors.password && (
                <p className='text-xs text-destructive'>{errors.password.message}</p>
              )}
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className='mt-5 text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link to={PATHS.SIGNUP} className='font-medium text-primary hover:underline'>
              Sign up free
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
