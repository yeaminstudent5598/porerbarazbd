// src/app/(main)/layout.tsx
'use client'; // motion component requires client component

import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

// Animation Variants for Admin Button
const buttonVariants = {
  rest: { width: 56, transition: { duration: 0.3 } },
  hover: { width: 120, transition: { duration: 0.3 } }
};
const textVariants = {
  rest: { opacity: 0, x: -10, display: 'none', transition: { duration: 0.2, delay: 0 } },
  hover: { opacity: 1, x: 0, display: 'inline', transition: { duration: 0.2, delay: 0.1 } }
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-grow">{children}</main> {/* Ensures content pushes footer */}
      <Footer />

      {/* Animated Hover Admin Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-50 overflow-hidden" // Placed here to be above footer potentially
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="hover" // Also expand on tap for touch devices
      >
        <Link
          href="/admin" // Link to admin section
          className="flex items-center h-14 p-4 bg-green-700 text-white rounded-full shadow-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 whitespace-nowrap"
          title="Admin Dashboard"
        >
          <Shield size={24} className="flex-shrink-0" />
          <motion.span
            className="ml-2 font-medium"
            variants={textVariants}
          >
            Admin
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}