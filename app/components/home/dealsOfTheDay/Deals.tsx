// src/components/home/dealsOfTheDay/Deals.tsx
'use client'; // motion requires client component

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProductCard } from '../../shared/ProductCard';
import Link from 'next/link';
// === Import shared ProductCard and variants ===

// Demo product data (same as before)
// TODO: Replace with actual data, maybe fetched or limited for homepage
const productData = [
    { id: 1, name: "কালোজিরা আচার", imageUrl: "/Images/pp1.jpeg", oldPrice: 1250, newPrice: 890, discount: "29%", category: "Achar" },
    { id: 2, name: "ঝুড়ি পিঠা", imageUrl: "/Images/p5.jpeg", oldPrice: 850, newPrice: 790, discount: "7%", category: "Pitha" },
    { id: 3, name: "রসুনের আচার", imageUrl: "/Images/pp2.jpeg", oldPrice: 850, newPrice: 690, discount: "19%", category: "Achar" },
    { id: 4, name: "১ কিজিঃ ৪ পিঠা কম্বো অফার", imageUrl: "/Images/pp3.jpeg", oldPrice: 990, newPrice: 690, discount: "30%", category: "Pitha" },
    { id: 5, name: "ঝিনুক পিঠা", imageUrl: "/Images/p3.jpeg", oldPrice: 850, newPrice: 590, discount: "31%", category: "Pitha" },
    { id: 6, name: "নকশি পিঠা", imageUrl: "/Images/p1.jpeg", oldPrice: 850, newPrice: 590, discount: "31%", category: "Pitha" },
    { id: 7, name: "১.৫ লিটার ৪ স্পেশাল কম্বো", imageUrl: "/Images/pp4.jpeg", oldPrice: 1800, newPrice: 1250, discount: "31%", category: "Oil" },
    { id: 8, name: "নকশি পিঠা", imageUrl: "/Images/p6.jpeg", oldPrice: 850, newPrice: 690, discount: "19%", category: "Pitha" },
    // Add more products if needed for homepage display
];

// Grid Container Variant
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Delay between each card appearing
    }
  }
};

const Deals = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50"> {/* Light background */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Featured Products {/* Changed title slightly */}
        </h2>

        {/* Grid container with motion */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" // Adjusted xl columns
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Animate when in view
          viewport={{ once: true, amount: 0.1 }} // Trigger animation early, once
          layout // Smooth layout changes
        >
          {/* Map productData to render ProductCard */}
          {productData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

         {/* Optional: View All Button */}
         <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
                <Link href="/products">View All Products</Link>
            </Button>
         </div>

      </div>
    </section>
  );
};

export default Deals;