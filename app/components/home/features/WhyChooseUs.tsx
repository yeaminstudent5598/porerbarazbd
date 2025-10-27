// src/components/home/features/WhyChooseUs.tsx
'use client'; // motion requires client component

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Truck, ShieldCheck, Award } from 'lucide-react'; // Icons
import { Variants } from "framer-motion";
const features = [
  {
    icon: <Leaf size={40} className="text-green-600" />,
    title: "১০০% খাঁটি ও অর্গানিক",
    description: "সরাসরি গ্রাম থেকে সংগ্রহ করা সম্পূর্ণ ভেজালমুক্ত পণ্য।"
  },
  {
    icon: <Truck size={40} className="text-green-600" />,
    title: "সারা দেশে ডেলিভারি",
    description: "অর্ডার করুন দেশের যেকোনো প্রান্ত থেকে, পৌঁছে যাবে আপনার ঠিকানায়।"
  },
  {
    icon: <ShieldCheck size={40} className="text-green-600" />,
    title: "নিরাপদ ও স্বাস্থ্যকর",
    description: "প্রতিটি পণ্য স্বাস্থ্যসম্মত উপায়ে প্যাক ও সংরক্ষণ করা হয়।"
  },
  {
    icon: <Award size={40} className="text-green-600" />,
    title: "ঐতিহ্যবাহী স্বাদের নিশ্চয়তা",
    description: "আমাদের প্রতিটি পিঠা ও আচারে পাবেন আসল গ্রামীণ স্বাদ।"
  }
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between items
    }
  }
};



// Define item variants
const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, // fixed type issue
      stiffness: 120
    }
  }
};


const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gray-50"> {/* Light gray background */}
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          কেন <span className="text-green-700">পরেরবাজারবিডি</span> সেরা?
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Animate when section is in view
          viewport={{ once: true, amount: 0.3 }} // Trigger animation earlier
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center border-t-4 border-green-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              variants={itemVariants} // Apply item animation
            >
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm"> {/* Slightly smaller text */}
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;