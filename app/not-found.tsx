// src/app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Optional: for styling
import { AlertTriangle } from 'lucide-react'; // Optional: icon

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
      <h1 className="text-6xl font-extrabold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild className="bg-green-600 hover:bg-green-700">
        <Link href="/">
          Go back to Homepage
        </Link>
      </Button>
    </div>
  );
}