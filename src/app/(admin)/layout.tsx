// src/app/(admin)/admin/layout.tsx
'use client'; // Required for Sheet, DropdownMenu, useNavigate

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Use next/navigation
import {
  Bell,
  Home,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Menu,
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils'; // For conditional classes

// অ্যাডমিন সাইডবারের লিঙ্ক
const adminNavLinks = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: '6' }, // Example badge
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: LineChart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get current path for active links
  const router = useRouter();

  const handleLogout = () => {
    console.log("Admin logging out...");
    // TODO: Implement admin logout logic (clear token, etc.)
    router.push('/login'); // Redirect to login page
  };


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

      {/* ===== Desktop Sidebar (Dark Theme) ===== */}
      <aside className="hidden border-r border-gray-700 bg-gray-900 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Sidebar Header */}
          <div className="flex h-14 items-center border-b border-gray-700 px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
              <Package className="h-6 w-6 text-green-500" />
              <span className="text-xl">PorerBazar Admin</span> {/* Updated Name */}
            </Link>
          </div>
          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-auto py-4 px-2 text-base font-medium lg:px-4">
            {adminNavLinks.map((link) => {
              // Basic check for active link (can be more sophisticated)
              const isActive = (link.href === '/admin' && pathname === '/admin') || (link.href !== '/admin' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 transition-all",
                    isActive
                      ? 'bg-green-600 text-white font-semibold shadow-inner'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.name}
                  {link.badge && (
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white border-green-700">
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ===== Mobile Header & Main Content ===== */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          {/* Mobile Menu Trigger (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden h-9 w-9"> <Menu className="h-5 w-5" /> <span className="sr-only">Toggle navigation menu</span> </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 bg-gray-900 border-r-0 w-full max-w-[280px]">
              {/* Mobile Sidebar Header */}
              <div className="flex h-14 items-center border-b border-gray-700 px-4 lg:h-[60px] lg:px-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
                  <Package className="h-6 w-6 text-green-500" /> <span className="text-xl">PorerBazar Admin</span>
                </Link>
              </div>
              {/* Mobile Sidebar Navigation */}
              <nav className="flex-1 overflow-auto py-4 px-2 text-base font-medium lg:px-4">
                {adminNavLinks.map((link) => {
                   const isActive = (link.href === '/admin' && pathname === '/admin') || (link.href !== '/admin' && pathname?.startsWith(link.href));
                   return(
                    <Link
                      key={link.name}
                      href={link.href}
                       className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 transition-all",
                        isActive
                          ? 'bg-green-600 text-white font-semibold shadow-inner'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                       )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                      {link.badge && (
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white border-green-700">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                   );
                 })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Header Right Side (Notification & Profile) */}
          <div className="w-full flex-1" /> {/* Spacer */}
          <Button variant="outline" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Admin" /> {/* TODO: Use actual admin avatar */}
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer focus:bg-red-50 focus:text-red-700">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50">
          {children} {/* Page content renders here */}
        </main>
      </div>
    </div>
  );
}