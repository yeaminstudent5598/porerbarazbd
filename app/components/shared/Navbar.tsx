// app/components/shared/Navbar.tsx
'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Search, Truck, User, ShoppingCart, Home, List } from 'lucide-react';
import { motion, type TargetAndTransition } from 'framer-motion';
import Marquee from "react-fast-marquee";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/app/lib/utils';
import { useSession, signOut } from "next-auth/react";

// Page Links
const pageLinks = [
  { name: 'Home', href: '/' },
  { name: 'All Products', href: '/products' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

// Category Links
const categoryLinks = [
  { name: 'Pitha', href: '/category/pitha' },
  { name: 'Achar', href: '/category/achar' },
  { name: 'Nuts & Dates', href: '/category/nuts-dates' },
  { name: 'Organic Spices', href: '/category/organic-spices' },
  { name: 'Organic Oil', href: '/category/organic-oil' },
  { name: 'Rice, Pulse', href: '/category/rice-pulse' },
  { name: 'Super Foods', href: '/category/super-foods' },
  { name: 'Sweeteners & Dairy', href: '/category/sweeteners-dairy' },
];

// Motion Effects
const iconHoverEffect: TargetAndTransition = { scale: 1.15, transition: { type: "spring", stiffness: 300 } };
const navLinkHoverEffect: TargetAndTransition = { y: -3, transition: { type: "spring", stiffness: 300 } };

// Mobile nav links
const mobileNavLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/products', icon: List },
    { name: 'Account', href: '/login', icon: User },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Search', href: '#', icon: Search },
];

// MotionImage
const MotionImage = motion(Image);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const cartItemCount = 0; // Placeholder
  const { data: session } = useSession(); // ✅ session

  return (
    <>
      {/* Desktop & Tablet Navigation */}
      <motion.header
        className="w-full shadow-sm sticky top-0 z-50 bg-white hidden md:block"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Top Bar */}
        <div className="bg-green-700 text-white py-2">
          <div className="container mx-auto flex justify-between items-center px-4 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>+8801716342167</span>
            </div>
            <div className="hidden md:block flex-grow overflow-hidden mx-8">
              <Marquee pauseOnHover={true} speed={40} gradient={false}>
                <span className="mx-12">গ্রামীণ ঐতিহ্যের খাঁটি স্বাদে স্বাগতম! 🍲 পিঠা, আচার ও অর্গানিক পণ্যে চলছে বিশেষ ছাড়! 🚚</span>
                <span className="mx-12">বিশ্বস্ততার সাথে সারা বাংলাদেশে হোম ডেলিভারী। 🌿</span>
              </Marquee>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white py-4">
          <div className="container mx-auto flex justify-between items-center px-4 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <MotionImage
                src="https://i.ibb.co/vxsq679p/Gemini-Generated-Image-deyncbdeyncbdeyn-removebg-preview.png"
                alt=" Shotej Foods"
                className="h-14 w-auto"
                whileHover={{ scale: 1.05 }}
                width={150}
                height={56}
                priority
              />
            </Link>

            {/* Desktop Search */}
            <form className="flex-grow max-w-lg hidden md:flex" onSubmit={(e) => e.preventDefault()}>
              <Input type="search" placeholder="Search Product..." className="rounded-r-none focus-visible:ring-offset-0 focus-visible:ring-green-700" />
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-l-none">
                <Search size={20} />
              </Button>
            </form>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4 md:gap-6">
              <motion.div whileHover={iconHoverEffect}>
                <Link href="/dashboard/orders" className="flex items-center gap-2 text-sm hover:text-green-600 transition-colors cursor-pointer">
                  <Truck size={20} />
                  <span className="hidden lg:block">Track Order</span>
                </Link>
              </motion.div>

              {/* Login / My Account */}
              {session?.user ? (
  <div className="flex items-center gap-4">
    {/* Username */}
    <motion.div
      whileHover={{ scale: 1.05, color: "#FACC15" }} // আলাদা hover animation
      className="flex items-center gap-1 cursor-pointer"
    >
      <User size={20} />
      <span className="hidden lg:block">{session.user.name}</span>
    </motion.div>

    {/* Logout Button */}
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: "#F87171", color: "#fff" }} // আলাদা hover animation
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-2 py-1 text-xs text-red-600 rounded"
    >
      Logout
    </motion.button>
  </div>
) : (
  <motion.div
    whileHover={{ scale: 1.05, color: "#4ADE80" }}
    className="flex items-center gap-2 cursor-pointer"
  >
    <Link href="/login" className="flex items-center gap-2">
      <User size={20} />
      <span className="hidden lg:block">Login / Sign Up</span>
    </Link>
  </motion.div>
)}


              {/* Cart */}
              <motion.div whileHover={iconHoverEffect}>
                <Link href="/cart" className="relative hover:text-green-600 transition-colors cursor-pointer">
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Desktop Category Links */}
        <nav className="bg-green-800 mb-0 text-white py-3 hidden md:flex">
          <div className="container mx-auto flex justify-center items-center px-4">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-x-8">
              <motion.li whileHover={navLinkHoverEffect}>
                <Link href="/products" className={cn(
                    "font-medium hover:text-yellow-300 transition-colors text-sm md:text-base",
                    pathname === '/products' && 'text-yellow-300 font-semibold'
                  )}>
                  All Products
                </Link>
              </motion.li>
              {categoryLinks.map((link) => (
                <motion.li key={link.name} whileHover={navLinkHoverEffect}>
                  <Link href={link.href} className={cn(
                      "font-medium hover:text-yellow-300 transition-colors text-sm md:text-base",
                      pathname === link.href && 'text-yellow-300 font-semibold'
                    )}>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Bottom Navigation */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <nav className="flex justify-around items-stretch h-16">
          {mobileNavLinks.map((link) => {
            const isActive = (link.href === '/' && pathname === '/') ||
                             (link.href !== '/' && link.href !== '#' && pathname.startsWith(link.href));

            if (link.name === 'Search') {
              return (
                <button
                  key={link.name}
                  onClick={() => alert('Search Clicked!')}
                  className="flex flex-col items-center justify-center text-xs font-medium transition-colors w-full text-gray-500 hover:text-green-600"
                >
                  <link.icon size={22} className="mb-0.5" />
                  <span>{link.name}</span>
                </button>
              );
            }

            if (link.name === 'Account') {
              return session?.user ? (
                <button
                  key="mobile-account"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex flex-col items-center justify-center text-xs font-medium text-red-600 hover:text-red-700 w-full"
                  >
                  <User size={22} className="mb-0.5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  key="mobile-account-login"
                  href="/login"
                  className="flex flex-col items-center justify-center text-xs font-medium text-gray-500 hover:text-green-600 w-full"
                >
                  <User size={22} className="mb-0.5" />
                  <span>Login</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center text-xs font-medium transition-colors w-full",
                  isActive ? "text-green-700" : "text-gray-500 hover:text-green-600"
                )}
              >
                {link.name === 'Cart' && cartItemCount > 0 ? (
                  <span className="relative">
                    <link.icon size={22} className="mb-0.5" />
                    <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">
                      {cartItemCount}
                    </span>
                  </span>
                ) : (
                  <link.icon size={22} className="mb-0.5" />
                )}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
