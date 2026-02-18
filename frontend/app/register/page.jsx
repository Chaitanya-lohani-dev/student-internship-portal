'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';

import { registerAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Register() {
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      setLoading(true);
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const validation = registerSchema.safeParse(data);

      if (!validation.success) {
        setIsError(true);
        setMessage('Please provide a name (min 3 chars), valid email, and password with at least 6 characters.');
        return;
      }

      const { name, email, password } = validation.data;
      const res = await registerAPI(name, email, password);

      if (res.message === 'User Registered') {
        setIsError(false);
        setMessage('Account created successfully. Redirecting to login...');
        setTimeout(() => router.push('/login'), 1000);
      } else if (res.message === 'User all ready exists') {
        setIsError(true);
        setMessage('User already exists. Redirecting to login...');
        setTimeout(() => router.push('/login'), 1000);
      } else {
        setIsError(true);
        setMessage('Error trying to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Join the internship portal and start applying to roles.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="flex items-center text-sm font-medium">
                  <span>Name</span>
                  <span className="ml-1 text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                />
              </div>

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
                    autoComplete="new-password"
                    required
                    placeholder="At least 6 characters"
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
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Already have an account?</span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
