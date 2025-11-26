'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProductCard } from '../../shared/ProductCard'; // আপনার এক্সিস্টিং কার্ড
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/fetcher';
import { Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const Deals = () => {
  // রিয়েল ডাটা ফেচ (Active products only)
  // products API তে status=Active ফিল্টার থাকা উচিত
  const { data: apiResponse, isLoading } = useSWR('/api/products?limit=10&status=Active', fetcher);
  const products = apiResponse?.data || [];

  if (isLoading) {
      return <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-green-600"/></div>;
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
          Featured Products
        </h2>

        {products.length > 0 ? (
            <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            layout
            >
            {products.map((product: any) => (
                // ProductCard কম্পোনেন্টে product prop পাঠানো হচ্ছে
                <ProductCard key={product._id} product={product} />
            ))}
            </motion.div>
        ) : (
            <p className="text-center text-gray-500">No deals available at the moment.</p>
        )}

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