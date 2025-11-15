// src/components/home/bestsellers/Bestsellers.tsx
'use client'; // motion requires client component

import React, { useRef } from 'react'; // useRef for constraints
import { motion } from 'framer-motion';
import { ProductCard } from '../../shared/ProductCard';

// Demo Data (replace with actual bestsellers)
const bestsellers = [
  // TODO: Add your actual bestseller product data here
  { id: 1, name: "ঝাল কালোজিরা আচার", imageUrl: "/Images/p1.jpeg", newPrice: 890, oldPrice: 1250, discount: "29%", category: "Achar" },
  { id: 9, name: "গোজাপ ফুল পিঠা", imageUrl: "/Images/p2.jpeg", newPrice: 590, oldPrice: 750, discount: "21%", category: "Pitha" },
  { id: 5, name: "ঝিনুক পিঠা", imageUrl: "/Images/p3.jpeg", newPrice: 590, oldPrice: 850, discount: "31%", category: "Pitha" },
  { id: 7, name: "১.৫ লিটার কম্বো", imageUrl: "/Images/p4.jpeg", newPrice: 1250, oldPrice: 1800, discount: "31%", category: "Oil" },
  { id: 2, name: "ঝুড়ি পিঠা", imageUrl: "/Images/p5.jpeg", newPrice: 790, oldPrice: 850, discount: "7%", category: "Pitha" },
  { id: 11, name: "ছোট নকশি পিঠা", imageUrl: "/Images/p6.jpeg", newPrice: 690, oldPrice: 850, discount: "19%", category: "Pitha" },
];


const Bestsellers = () => {
  const constraintsRef = useRef<HTMLDivElement>(null); // Ref for drag constraints

  return (
    <section className="py-16 bg-white overflow-hidden"> {/* Added overflow-hidden */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          আমাদের বেস্টসেলার পণ্য
        </h2>

        {/* Outer container for masking and constraints */}
        <motion.div
          ref={constraintsRef} // Apply ref here
          className="cursor-grab overflow-hidden" // Hide overflow
           style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }} // Optional: Fade edges
        >
          {/* Draggable container */}
          <motion.div
            className="flex gap-6 pb-4 w-max" // w-max is important
            drag="x" // Allow horizontal drag
            // Calculate constraints dynamically based on width
            dragConstraints={constraintsRef}
            // Optional: Add drag elasticity
            // dragElastic={0.1}
          >
            {bestsellers.map((product) => (
              // Use a div wrapper for layout within the flex container
              <div key={product.id} className="w-64 md:w-72 flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Bestsellers;