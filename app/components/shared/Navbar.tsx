// src/components/shared/Navbar.tsx
'use client'; // Required for useState, event handlers, framer-motion

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link'; // Use Next.js Link
import { usePathname } from 'next/navigation'; // Use Next.js hook for active path
import { Phone, Search, Truck, User, ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Marquee from "react-fast-marquee";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/app/lib/utils';

// Page Links (for mobile menu primarily)
const pageLinks = [
  { name: 'Home', href: '/' },
  { name: 'All Products', href: '/products' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

// Category Links (for desktop nav and mobile)
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

// Animation Variants
const iconHoverEffect = { scale: 1.15, transition: { type: "spring", stiffness: 300 } };
const navLinkHoverEffect = { y: -3, transition: { type: "spring", stiffness: 300 } };
const mobileMenuVariant = {
  hidden: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeOut" } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeIn" } }
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current path
  // TODO: Get cart item count from global state (e.g., CartContext)
  const cartItemCount = 0; // Placeholder

  return (
    <motion.header
      className="w-full shadow-sm sticky top-0 z-50 bg-white"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Top Bar */}
      <div className="bg-green-700 text-white py-2">
        <div className="container mx-auto flex justify-between items-center px-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <Phone size={16} />
            {/* TODO: Add your actual phone number */}
            <span>+8801716342167</span>
          </div>
          <div className="hidden md:block flex-grow overflow-hidden mx-8">
            <Marquee pauseOnHover={true} speed={40} gradient={false}>
              <span className="mx-12">গ্রামীণ ঐতিহ্যের খাঁটি স্বাদে স্বাগতম! 🍲 পিঠা, আচার ও অর্গানিক পণ্যে চলছে বিশেষ ছাড়! 🚚</span>
              <span className="mx-12">বিশ্বস্ততার সাথে সারা বাংলাদেশে হোম ডেলিভারী। 🌿</span>
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
            <motion.img
              // TODO: আপনার আসল লোগো ব্যবহার করুন (/public ফোল্ডারে রাখুন)
              src="https://i.ibb.co.com/vxsq679p/Gemini-Generated-Image-deyncbdeyncbdeyn-removebg-preview.png" // ধরে নিচ্ছি logo.png public ফোল্ডারে আছে
              alt="Porer Bazar BD"
              className="w-16" // উচ্চতা ঠিক করুন
              whileHover={{ scale: 1.05 }}
              width={150} // আনুমানিক প্রস্থ দিন
              height={56} // আনুমানিক উচ্চতা দিন
            />
          </Link>

          {/* Desktop Search */}
          <form className="flex-grow max-w-lg hidden md:flex" onSubmit={(e) => e.preventDefault()}> {/* TODO: Implement search */}
            <Input type="search" placeholder="Search Product..." className="rounded-r-none focus-visible:ring-offset-0 focus-visible:ring-green-700" />
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-l-none"> <Search size={20} /> </Button>
          </form>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-4 md:gap-6">
            <motion.div whileHover={iconHoverEffect}>
              {/* TODO: Update Track order link if needed */}
              <Link href="/dashboard/orders" className="flex items-center gap-2 text-sm hover:text-green-600 transition-colors cursor-pointer">
                <Truck size={20} />
                <span className="hidden lg:block">Track Order</span>
              </Link>
            </motion.div>
            <motion.div whileHover={iconHoverEffect}>
              {/* TODO: Check auth status and show Profile or Login */}
              <Link href="/login" className="flex items-center gap-2 text-sm hover:text-green-600 transition-colors cursor-pointer">
                <User size={20} />
                <span className="hidden lg:block">Login / Sign Up</span>
              </Link>
            </motion.div>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/cart" className="relative hover:text-green-600 transition-colors">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                 <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                   {cartItemCount}
                 </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="bg-green-800 text-white py-3 hidden md:flex">
        <div className="container mx-auto flex justify-center items-center px-4">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-x-8">
            <motion.li whileHover={navLinkHoverEffect}>
              <Link href="/products" className={cn(
                  "font-medium hover:text-yellow-300 transition-colors text-sm md:text-base",
                  pathname === '/products' && 'text-yellow-300 font-semibold' // Active style
                )}>
                  All Products
              </Link>
            </motion.li>
            {categoryLinks.map((link) => (
              <motion.li key={link.name} whileHover={navLinkHoverEffect}>
                <Link href={link.href} className={cn(
                    "font-medium hover:text-yellow-300 transition-colors text-sm md:text-base",
                    pathname === link.href && 'text-yellow-300 font-semibold' // Active style
                  )}>
                    {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute w-full bg-white shadow-lg z-40 p-4 border-t max-h-[calc(100vh-100px)] overflow-y-auto" // Added height limit and scroll
            variants={mobileMenuVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Mobile Search */}
            <form className="flex w-full mb-4" onSubmit={(e) => e.preventDefault()}> {/* TODO: Implement Search */}
              <Input type="search" placeholder="Search Product..." className="rounded-r-none focus-visible:ring-offset-0 focus-visible:ring-green-700" />
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-l-none"> <Search size={20} /> </Button>
            </form>

            {/* Mobile Page Links */}
            <nav className="mb-4">
              <ul className="flex flex-col gap-1">
                {pageLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                          "block p-3 rounded-md font-medium text-gray-700 hover:bg-gray-100",
                           pathname === link.href && 'bg-green-50 text-green-700' // Active style
                        )}
                      onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Separator className="my-4" />

            {/* Mobile Category Links */}
            <h3 className="font-semibold text-gray-800 mb-2 px-3 text-sm uppercase tracking-wider">Shop by Category</h3>
            <nav className="mb-4">
               <ul className="flex flex-col gap-1">
                {categoryLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                          "block p-3 rounded-md font-medium text-gray-700 hover:bg-gray-100",
                          pathname === link.href && 'bg-green-50 text-green-700' // Active style
                        )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Separator className="my-4" />

            {/* Mobile Top Icon Links */}
            <div className="flex flex-col gap-2">
              <Link href="/dashboard/orders" className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
                <Truck size={20} />
                <span>Track Order</span>
              </Link>
              {/* TODO: Check auth status */}
              <Link href="/login" className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
                <User size={20} />
                <span>Login / Sign Up</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;