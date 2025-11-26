// app/(auth)/register/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { UserPlus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Google সাইন-ইন-এর জন্য

// Google Icon SVG (লগইন পেজের মতো)
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" {...props}><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
);

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const callbackUrl = '/dashboard/profile'; // রেজিস্ট্রেশন বা Google সাইন-ইনের পর কোথায় যাবে

  // ম্যানুয়াল রেজিস্ট্রেশন হ্যান্ডলার
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // === API রুটকে কল করা ===
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.message || 'Registration failed.';
        // Zod validation errors
        if (data.errors) {
             const fieldErrors = Object.values(data.errors).flat();
             errorMessage = fieldErrors[0] as string || 'Please check your inputs.';
        }
        throw new Error(errorMessage);
      }
      
      // সফল হলে ইউজারকে লগইন পেজে পাঠানো
      alert('Registration successful! Please log in.');
      router.push('/login'); // <-- সঠিক পাথ: /login
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // গুগল সাইন-ইন হ্যান্ডলার (এটি একই সাথে সাইন-আপও করে)
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // next-auth-এর /api/auth/[...nextauth] রুটকে কল করে
      await signIn('google', { callbackUrl });
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-lg shadow-xl border">
        
        <div className="text-center">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="Shotej Foods" className="h-14 mx-auto" />
          </Link>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
            নতুন একাউন্ট তৈরি করুন
          </h2>
        </div>

        {/* গুগল সাইন-ইন বাটন */}
        <Button 
          variant="outline" 
          className="w-full text-base" 
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 h-5 w-5" />
          )}
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or register with email</span>
          </div>
        </div>

        {/* ম্যানুয়াল রেজিস্ট্রেশন ফর্ম */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <p className="text-center text-sm font-medium text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </p>
          )}

          <div>
            <Label htmlFor="name">আপনার নাম</Label>
            <Input 
              type="text" id="name" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার সম্পূর্ণ নাম" required className="mt-2"
              disabled={isLoading || isGoogleLoading}
            />
          </div>
          <div>
            <Label htmlFor="email">ইমেইল এড্রেস</Label>
            <Input 
              type="email" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com" required className="mt-2"
              disabled={isLoading || isGoogleLoading}
            />
          </div>
          <div>
            <Label htmlFor="password">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</Label>
            <Input 
              type="password" id="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required className="mt-2"
              disabled={isLoading || isGoogleLoading}
            />
          </div>

          <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading || isGoogleLoading}>
            {isLoading && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
            {isLoading ? 'রেজিস্টার হচ্ছে...' : 'রেজিস্ট্রেশন করুন'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          ইতোমধ্যে একাউন্ট আছে?{' '}
          {/* === সঠিক লিঙ্ক: /login === */}
          <Link href="/login" className="font-medium text-green-700 hover:underline">
            এখানে লগইন করুন
          </Link>
        </p>

      </div>
    </div>
  );
}