// app/(user)/dashboard/layout.tsx
'use client'; // Required for usePathname, useRouter, event handlers

import React from 'react';
import Link from 'next/link'; // <-- Use Next.js Link
import { usePathname, useRouter } from 'next/navigation'; // <-- Use Next.js hooks
import { User, Archive, MapPin, LogOut } from 'lucide-react';
import { cn } from '@/app/lib/utils';

// Sidebar links (unchanged)
const sidebarLinks = [
  { name: 'My Profile', href: '/dashboard/profile', icon: User },
  { name: 'My Orders', href: '/dashboard/orders', icon: Archive },
  { name: 'My Addresses', href: '/dashboard/addresses', icon: MapPin },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter(); // <-- Use Next.js useRouter
  const pathname = usePathname(); // <-- Use Next.js usePathname

  const handleLogout = () => {
    console.log("User logging out...");
    // TODO: Add logout logic (clear token/session)
    router.push('/login'); // Redirect using Next.js router
  };

  return (
    // Layout structure remains the same
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            My Account
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
            <nav className="bg-white p-6 rounded-lg shadow-md sticky top-24 self-start">
              <ul className="space-y-2">
                {sidebarLinks.map((link) => {
                  // Check if the current path exactly matches the link href
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.name}>
                      <Link // <-- Use Next.js Link
                        href={link.href}
                        className={cn(
                          `flex items-center gap-3 p-3 rounded-md transition-all duration-300 font-medium`,
                          isActive
                            ? 'bg-green-100 text-green-700 font-semibold' // Active style
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Inactive style
                        )}
                      >
                        <link.icon size={20} />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
                {/* Logout Button */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-md transition-all duration-300 font-medium w-full text-left text-red-500 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" // Added focus styles
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md min-h-[400px]">
              {children} {/* Sub-pages render here */}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}