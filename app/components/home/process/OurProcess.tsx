// src/components/home/process/OurProcess.tsx
'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Leaf, Award, PackageCheck, Truck } from 'lucide-react'; // Icons

// Process steps data
const processSteps = [
  {
    icon: <Leaf size={48} className="text-green-600" />,
    title: "খাঁটি উৎসের সন্ধান",
    description: "আমরা সরাসরি গ্রাম থেকে সেরা কৃষক এবং উৎপাদকের কাছ থেকে পণ্য সংগ্রহ করি।"
  },
  {
    icon: <Award size={48} className="text-green-600" />,
    title: "মান নিয়ন্ত্রণ",
    description: "প্রতিটি পণ্য আমাদের নিজস্ব ল্যাবে পরীক্ষা করা হয় যাতে এর গুণমান ১০০% নিশ্চিত থাকে।"
  },
  {
    icon: <PackageCheck size={48} className="text-green-600" />,
    title: "স্বাস্থ্যসম্মত প্যাকিং",
    description: "পণ্যের স্বাদ ও গুণ অটুট রাখতে আমরা স্বাস্থ্যসম্মত উপায়ে ফুড-গ্রেড প্যাকেজিং করি।"
  },
  {
    icon: <Truck size={48} className="text-green-600" />,
    title: "দ্রুততম ডেলিভারি",
    description: "অর্ডার করার পর যত দ্রুত সম্ভব আপনার ঠিকানায় ফ্রেশ পণ্য পৌঁছে দেওয়াই আমাদের লক্ষ্য।"
  }
];

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100 } // as const fixes TS type error
  }
};

const OurProcess: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">

        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">
            কীভাবে আমরা <span className="text-green-700">খাঁটি মান</span> নিশ্চিত করি?
          </h2>
          <p className="text-gray-600 mt-2">গ্রামের উঠান থেকে আপনার রান্নাঘর পর্যন্ত</p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              className="relative bg-gray-50 p-6 rounded-lg shadow-lg text-center transition-shadow duration-300 hover:shadow-xl border-b-4 border-green-600"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {/* Step Number Badge */}
              <span className="absolute -top-4 -left-4 bg-green-600 text-white font-bold rounded-full h-10 w-10 flex items-center justify-center text-xl shadow-md">
                {index + 1}
              </span>

              {/* Icon */}
              <div className="inline-block p-4 bg-green-100 rounded-full mb-5">
                {step.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurProcess;
