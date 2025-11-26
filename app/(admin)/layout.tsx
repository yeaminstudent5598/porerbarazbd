// app/(admin)/layout.tsx
'use client'; 

import React, { useState, useEffect } from 'react'; // <-- useState, useEffect ইম্পোর্ট করুন
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Home,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Menu,
  Settings,
  LifeBuoy,
  LogOut,
  LayoutGrid
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
import { cn } from '../lib/utils';
// TODO: Import useAuth to get user info for Avatar
// import { useAuth } from '@/context/AuthContext';

const adminNavLinks = [
  { name: 'Dashboard', href: '/admin', icon: Home, exact: true },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: '6' },
  { name: 'Categories', href: '/admin/categories', icon: LayoutGrid },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: LineChart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // const { user, logout } = useAuth(); // TODO: Use AuthContext

  // === হাইড্রেশন এরর সমাধানের জন্য ===
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  // ==================================

  const handleLogout = () => {
    console.log("Admin logging out...");
    // TODO: logout(); // Call logout from context
    router.push('/login');
  };

  // এই ফাংশনটি সাইডবার লিঙ্কগুলো রেন্ডার করে (ডেস্কটপ ও মোবাইল)
  const renderNavLinks = () => (
     <nav className="flex-1 overflow-auto py-4 px-2 text-base font-medium lg:px-4">
      {adminNavLinks.map((link) => {
        const isActive = (link.exact ? pathname === link.href : (pathname ? pathname.startsWith(link.href) : false));
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 my-1 transition-all",
              isActive
                ? 'bg-green-600 text-white font-semibold shadow-inner'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <link.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-grow">{link.name}</span>
            {link.badge && (
              <Badge className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-700 text-white border-green-800 p-0 text-xs">
                {link.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );

  // === যতক্ষণ মাউন্ট হয়নি, ততক্ষণ একটি সিম্পল হেডার দেখানো হচ্ছে ===
  const renderHeaderContent = () => {
    if (!hasMounted) {
      return <div className="w-full flex-1" />; // শুধু স্পেসার
    }
    
    // মাউন্ট হওয়ার পর আসল হেডার কন্টেন্ট
    return (
      <>
        {/* --- মোবাইল মেনু (Sheet) --- */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden h-9 w-9">
               <Menu className="h-5 w-5" />
               <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 bg-gray-900 border-r-0 w-full max-w-[280px]">
            <div className="flex h-14 items-center border-b border-gray-700 px-4 lg:h-[60px] lg:px-6">
              <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
                <Package className="h-6 w-6 text-green-500" />
                <span className="text-xl">ShotejFoods Admin</span>
              </Link>
            </div>
            {renderNavLinks()} {/* মোবাইল সাইডবার লিঙ্ক */}
          </SheetContent>
        </Sheet>

        {/* --- টপ বার (নোটিফিকেশন ও প্রোফাইল) --- */}
        <div className="w-full flex-1" /> {/* Spacer */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="Admin Avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
               <LifeBuoy className="mr-2 h-4 w-4" />
               <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer focus:bg-red-50 focus:text-red-700">
              <LogOut className="mr-2 h-4 w-4"/>
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* ===== ডেস্কটপ সাইডবার (ডার্ক থিম) ===== */}
      <aside className="hidden border-r border-gray-700 bg-gray-900 md:block print:hidden">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-gray-700 px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
              <Package className="h-6 w-6 text-green-500" />
              <span className="text-xl">ShotejFoods Admin</span>
            </Link>
          </div>
          {renderNavLinks()} {/* সাইডবার লিঙ্ক */}
        </div>
      </aside>

      {/* ===== মোবাইল হেডার ও প্রধান কন্টেন্ট ===== */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 print:hidden">
          {renderHeaderContent()} {/* <-- ডাইনামিক হেডার কন্টেন্ট */}
        </header>

        {/* ===== প্রধান কন্টেন্ট এরিয়া ===== */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-100 dark:bg-gray-950">
          {children} {/* Page content renders here */}
        </main>
      </div>
    </div>
  );
}