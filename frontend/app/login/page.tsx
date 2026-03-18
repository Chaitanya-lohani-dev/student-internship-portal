'use client';
import { useState } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { loginAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginResponse = { role: string };

export default function Login() {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      setLoading(true);

      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      const validation = loginSchema.safeParse(data);

      if (!validation.success) {
        setIsError(true);
        setMessage('Please enter a valid email and a password with at least 6 characters.');
        return;
      }

      const { email, password } = validation.data;
      const res: LoginResponse | undefined = await loginAPI(email, password);

      if (res?.role === 'student') {
        setIsError(false);
        setMessage('Login successful. Redirecting to jobs...');
        router.push('/student/jobs');
      } else if (res?.role === 'admin') {
        setIsError(false);
        setMessage('Login successful. Redirecting to admin page...');
        router.push('/admin');
      } else {
        setIsError(true);
        setMessage('Error trying to login. Please check your credentials and try again.');
      }
    } catch (error) {
      setIsError(true);
      setMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to continue to the internship portal.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="flex items-center text-sm font-medium">
                  <span>Email</span>
                  <span className="ml-1 text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="flex items-center text-sm font-medium">
                  <span>Password</span>
                  <span className="ml-1 text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>

              {message && (
                <Alert variant={isError ? 'error' : 'success'}>
                  <span>{message}</span>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Don't have an account?</span>
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register now
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

