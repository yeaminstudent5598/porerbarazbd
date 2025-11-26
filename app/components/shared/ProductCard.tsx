'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Next.js Image optimization
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { mutate } from 'swr'; // Global state update

// Animation variants for card hover
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -5, transition: { duration: 0.2 } }
};

export const ProductCard = ({ product }: { product: any }) => {
  const { data: session } = useSession();

  // ✅ FIX: MongoDB এর _id অথবা ডেমো ডাটার id চেক করা হচ্ছে
  const productId = product._id || product.id;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link এ ক্লিক হওয়া আটকাবে
    e.stopPropagation();

    if (!session) {
      toast.error("Please login to add to cart");
      return;
    }

    try {
      const res = await fetch('/api/v1/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any).accessToken}`
        },
        body: JSON.stringify({ productId: productId, quantity: 1 })
      });

      if (!res.ok) throw new Error("Failed");
      
      toast.success("Added to cart!");
      mutate('/api/v1/cart'); // কার্ট আপডেট হবে সাথে সাথে
    } catch (err) {
      toast.error("Could not add to cart");
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden group flex flex-col h-full relative"
    >
      {/* Discount Badge */}
      {product.discount && (
        <Badge className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white border-none">
          {product.discount} OFF
        </Badge>
      )}

      {/* Image Section */}
      <Link href={`/product/${productId}`} className="relative h-48 w-full bg-gray-50 block overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            No Image
          </div>
        )}
        
        {/* Quick View Overlay (Optional) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <Eye size={16} className="mr-2"/> View Details
            </Button>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category (Optional) */}
        {product.category && (
            <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        )}

        <Link href={`/product/${productId}`} className="block">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-green-600 transition-colors" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Rating (Static for now or dynamic if available) */}
        <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
                ))}
            </div>
            <span className="text-xs text-gray-400 ml-1">({product.reviewsCount || 0})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
             {product.oldPrice && (
                <span className="text-xs text-gray-400 line-through">৳ {product.oldPrice}</span>
             )}
             <span className="text-lg font-bold text-green-700">৳ {product.price}</span>
          </div>

          <Button 
            size="icon" 
            className="rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border-green-200 transition-colors"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};