// src/components/home/testimonials/Testimonials.tsx
'use client'; // swiper requires client component

import React from 'react';
import { motion } from 'framer-motion';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay'; // Only Autoplay styles needed for marquee

// Import required modules
import { Autoplay } from 'swiper/modules';

import { Star, Quote } from 'lucide-react'; // Icons

// Demo review data
const reviews = [
    { name: "সাদিয়া ইসলাম", location: "ঢাকা", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250", review: "পরেরবাজারবিডির আচারগুলো ঠিক যেন দাদীর হাতের বানানো! স্বাদ আর মান দুটোই অসাধারণ। ধন্যবাদ এমন খাঁটি জিনিস পৌঁছে দেওয়ার জন্য।" },
    { name: "আরিফুর রহমান", location: "চট্টগ্রাম", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250", review: "ওদের অর্গানিক মশলা ব্যবহার করছি। রান্নার স্বাদই বদলে গেছে। বিশেষ করে হলুদের রঙ আর ঘ্রাণটা একদম খাঁটি।" },
    { name: "নাসরিন সুলতানা", location: "খুলনা", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250", review: "শীতের পিঠা অর্ডার করেছিলাম। ঝিনুক পিঠা আর নকশি পিঠা দুটোই খুব ফ্রেশ আর সুস্বাদু ছিল। ডেলিভারিও সময়মতো পেয়েছি।" },
    { name: "কামাল আহমেদ", location: "সিলেট", image: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=250", review: "অফিসের জন্য একসাথে অনেকগুলো কম্বো অর্ডার করেছিলাম। সবাই খুব প্রশংসা করেছে। প্যাকিজিং খুবই সুন্দর এবং প্রফেশনাল ছিল।" },
    { name: "ফারজানা আক্তার", location: "রাজশাহী", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250", review: "বাচ্চাদের জন্য বাদাম আর খেজুর নিয়েছিলাম। কোয়ালিটি খুবই প্রিমিয়াম। নির্দ্বিধায় আবারও অর্ডার করবো।" },
    { name: "মিজানুর চৌধুরী", location: "ঢাকা", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250", review: "রসুনের আচারটা আমার খুবই ভালো লেগেছে। ঝাল-মিষ্টির দারুণ একটা ব্যালেন্স। রুটি বা ভাতের সাথে খাওয়ার জন্য পারফেক্ট।" }
];

// Animation variant for the title
const fadeInAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50 overflow-hidden"> {/* Added overflow-hidden */}
      <div className="container mx-auto px-4">

        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial="initial"
          whileInView="animate" // Use whileInView from motion
          variants={fadeInAnimation}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">
            আমাদের কাস্টমাররা কী বলেন
          </h2>
          <p className="text-gray-600 mt-2">
            আমাদের সেবায় যারা সন্তুষ্ট
          </p>
        </motion.div>

        {/* Swiper Marquee Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Swiper
            // Swiper Modules for Marquee
            modules={[Autoplay]}
            loop={true} // Enable continuous loop
            freeMode={true} // Slides float freely
            // allowTouchMove={false} // Disable manual swipe (optional for pure marquee)
            slidesPerView={'auto'} // Each slide takes its own width
            spaceBetween={30} // Space between slides
            autoplay={{
              delay: 1, // Start immediately
              disableOnInteraction: false, // Continue autoplay even after interaction
              pauseOnMouseEnter: true, // Pause when mouse hovers over slider
            }}
            speed={8000} // Speed of the transition (higher value = slower)
            className="w-full py-4" // Add some padding if needed
            grabCursor={true} // Show grab cursor on hover
          >
            {reviews.map((item, index) => (
              <SwiperSlide
                key={index}
                // Set a fixed width for each slide, important for 'auto' slidesPerView
                className="!w-80 md:!w-96 !h-auto" // Ensure height adjusts, set width
              >
                {/* Card content */}
                <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-green-600 h-full flex flex-col transition-shadow duration-300 hover:shadow-xl">
                  {/* Star Rating */}
                  <div className="flex text-yellow-500 mb-4">
                    {/* Assuming 5 stars for all demo reviews */}
                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={18} />)}
                  </div>

                  {/* Review Text */}
                  <div className="relative mb-4 flex-grow"> {/* Allow text to grow */}
                    <Quote size={28} className="absolute -top-3 -left-4 text-gray-200 opacity-70" />
                    <p className="text-gray-600 italic z-10 relative text-sm leading-relaxed">"{item.review}"</p>
                  </div>

                  {/* Customer Profile */}
                  <div className="flex items-center mt-6 pt-4 border-t border-gray-100"> {/* Added more top margin */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-200" // Slightly smaller image
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">{item.name}</h4> {/* Adjusted size */}
                      <p className="text-gray-500 text-xs">{item.location}</p> {/* Adjusted size */}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;