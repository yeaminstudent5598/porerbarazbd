// src/components/shared/ProductCard.tsx
'use client'; // motion requires client component

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Card item animation variant (exported)
export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

// Define Product Type (adjust based on your actual data)
interface Product {
  id: number | string;
  name: string;
  imageUrl: string;
  oldPrice?: number; // Optional old price
  newPrice: number;
  discount?: string; // Optional discount badge text
}

interface ProductCardProps {
  product: Product;
}

// ProductCard component (exported)
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, imageUrl, oldPrice, newPrice, discount } = product;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col transition-shadow duration-300 hover:shadow-xl group"
      variants={itemVariants}
      layout // Ensures smooth layout changes if items are filtered
      whileHover={{ y: -5 }} // Slight lift on hover
    >
      {/* Image & Badge Container */}
      <div className="relative">
        <Link href={`/product/${id}`} className="block overflow-hidden aspect-square"> {/* Aspect ratio for consistent height */}
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            loading="lazy"
            // Add width/height for Next.js Image component if you switch later
            // width={300}
            // height={300}
          />
        </Link>
        {discount && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            {discount} ছাড়
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-base mb-2 min-h-[40px] line-clamp-2"> {/* Fixed height, line clamping */}
          <Link href={`/product/${id}`} className="hover:text-green-700 transition-colors">
            {name}
          </Link>
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-2"> {/* mt-auto pushes price down */}
          <span className="text-green-700 font-bold text-lg">৳ {newPrice}</span>
          {oldPrice && (
            <span className="text-gray-400 line-through text-sm">৳ {oldPrice}</span>
          )}
        </div>

        {/* Add to Cart Button (or View Details) */}
        <Button asChild size="sm" className="w-full mt-3 bg-green-600 text-white text-center font-medium rounded-lg transition-all duration-300 hover:bg-green-700 active:scale-95">
           <Link href={`/product/${id}`}>
             বিস্তারিত দেখুন
           </Link>
        </Button>
         {/* TODO: Or implement Add to Cart functionality */}
         {/* <Button size="sm" className="w-full mt-3 ..." onClick={handleAddToCart}>Add to Cart</Button> */}
      </div>
    </motion.div>
  );
};