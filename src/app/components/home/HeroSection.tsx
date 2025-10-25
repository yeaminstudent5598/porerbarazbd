// src/components/home/HeroSection.tsx
'use client'; // motion requires client component

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  // TODO: Replace with your high-quality banner image URL
  const heroImageUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974";

  return (
    <section
      className="relative w-full h-[60vh] md:h-[75vh] bg-cover bg-center flex items-center justify-center" // Added flex for centering
      style={{ backgroundImage: `url(${heroImageUrl})` }}
      aria-labelledby="hero-heading" // Accessibility
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-3xl"> {/* Added max-width */}

        {/* Animated Heading */}
        <motion.h1
          id="hero-heading" // Accessibility
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          গ্রামীণ ঐতিহ্যের খাঁটি স্বাদ
        </motion.h1>

        {/* Animated Subheading */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl mb-8 text-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          টাটকা মশলা, হাতে বানানো পিঠা, এবং অর্গানিক পণ্যের সেরা সংগ্রহ - সরাসরি গ্রাম থেকে আপনার দরজায়।
        </motion.p>

        {/* Animated Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 120 }}
        >
          <Button
            size="lg"
            asChild // Allows Link to inherit Button styles
            className="bg-green-600 hover:bg-green-700 text-base md:text-lg font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95" // Added active state
          >
            <Link href="/products">
              <ShoppingBag className="mr-2 h-5 w-5" />
              এখনই শপ করুন
            </Link>
          </Button>
        </motion.div>
      </div>
      {/* Reminder to add text-shadow utility in globals.css if not already present */}
    </section>
  );
};

export default HeroSection;