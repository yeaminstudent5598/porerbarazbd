// src/components/shared/ProductCard.tsx
'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Product Type
interface Product {
  id: number | string;
  name: string;
  imageUrl: string;
  oldPrice?: number;
  newPrice: number;
  discount?: string;
}

interface ProductCardProps {
  product: Product;
}

// Animation Variants (TypeScript-friendly)
export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring" as const, stiffness: 100 } // 'as const' fixes the type
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, imageUrl, oldPrice, newPrice, discount } = product;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col transition-shadow duration-300 hover:shadow-xl group"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      layout
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <Link href={`/product/${id}`} className="block overflow-hidden aspect-square">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        {discount && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            {discount} ছাড়
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-base mb-2 min-h-[40px] line-clamp-2">
          <Link href={`/product/${id}`} className="hover:text-green-700 transition-colors">
            {name}
          </Link>
        </h3>

        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-green-700 font-bold text-lg">৳ {newPrice}</span>
          {oldPrice && (
            <span className="text-gray-400 line-through text-sm">৳ {oldPrice}</span>
          )}
        </div>

        <Button
          asChild
          size="sm"
          className="w-full mt-3 bg-green-600 text-white text-center font-medium rounded-lg transition-all duration-300 hover:bg-green-700 active:scale-95"
        >
          <Link href={`/product/${id}`}>বিস্তারিত দেখুন</Link>
        </Button>
      </div>
    </motion.div>
  );
};
