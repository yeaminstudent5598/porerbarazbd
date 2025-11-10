// app/components/home/FacebookStoryFeed.tsx
'use client'; 

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
} from 'lucide-react'; 

// --- স্টোরির জন্য ডেমো ডেটা ---
// এই ডেটা আপনি অ্যাডমিন প্যানেল থেকে fetch করবেন
const storyData = [
  { 
    id: 1,
    name: 'Demo 1', 
    href: '/category/demo1', 
    imageUrl: '/Images/demo1.jpeg',  // public থেকে লোড
    profileUrl: '/Images/demo1.jpeg'
  },
  { 
    id: 2,
    name: 'Demo 2', 
    href: '/category/demo2', 
    imageUrl: '/Images/demo2.jpeg',
    profileUrl: '/Images/demo2.jpeg'
  },
  { 
    id: 3,
    name: 'Demo 3', 
    href: '/category/demo3', 
    imageUrl: '/Images/demo3.jpeg',
    profileUrl: '/Images/demo3.jpeg'
  },
  { 
    id: 4,
    name: 'Demo 3', 
    href: '/category/demo4', 
    imageUrl: '/Images/demo4.jpeg',
    profileUrl: '/Images/demo3.jpeg'
  },
  { 
    id: 5,
    name: 'Demo 3', 
    href: '/category/demo5', 
    imageUrl: '/Images/demo5.jpeg',
    profileUrl: '/Images/demo3.jpeg'
  },
  { 
    id: 6,
    name: 'Demo 3', 
    href: '/category/demo3', 
    imageUrl: '/Images/demo6.jpeg',
    profileUrl: 'https://i.ibb.co/vxsq679p/Gemini-Generated-Image-deyncbdeyncbdeyn-removebg-preview.png'
  },
  { 
    id: 7,
    name: 'Demo 3', 
    href: '/category/demo3', 
    imageUrl: '/Images/demo7.jpeg',
    profileUrl: '/Images/demo3.jpeg'
  },
  { 
    id: 8,
    name: 'Demo 3', 
    href: '/category/demo3', 
    imageUrl: '/Images/demo8.jpeg',
    profileUrl: '/Images/demo3.jpeg'
  },
];


// --- টাইপ সংজ্ঞা ---
interface Story {
  id: number;
  name: string;
  href: string;
  imageUrl: string;
  profileUrl: string;
}

// --- একটি স্টোরি কার্ড ---
interface StoryCardProps extends Story {
  onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ name, imageUrl, profileUrl, onClick }) => {
  return (
    <motion.div 
      onClick={onClick}
      className="flex-shrink-0 w-32 md:w-40 aspect-[9/16] rounded-xl overflow-hidden shadow-lg group relative cursor-pointer"
    >
      <Image
        src={imageUrl}
        alt={name}
        fill
        style={{ objectFit: 'cover' }}
        className="z-0 transition-transform duration-500 ease-in-out group-hover:scale-110"
        sizes="(max-width: 768px) 33vw, 10vw"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      <div className="absolute top-3 left-3 z-20">
        {/* এখানে আপনার মেইন লোগো বা ক্যাটাগরি আইকন বসাতে পারেন */}
        <div className="w-10 h-10 rounded-full border-4 border-green-600 overflow-hidden">
          <Image
            src={profileUrl}
            alt={`${name} icon`}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="absolute bottom-3 left-3 z-20">
        <h3 className="font-semibold text-white text-base leading-tight text-shadow-md">
          {name}
        </h3>
      </div>
    </motion.div>
  );
};

// --- "Create Story" কার্ড (প্রথম কার্ড) ---


// --- 🌟 সিম্পল স্টোরি ভিউয়ার মোডাল 🌟 ---
interface StoryViewerModalProps {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
  // একটি প্রোফাইল পাস করুন, যা সব স্টোরির জন্য একই
  mainProfile: { 
    name: string;
    logo: string; 
  }
}

const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ stories, startIndex, onClose, mainProfile }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const currentStory = stories[currentIndex];

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const goToPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  // কী-বোর্ড নেভিগেশন
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      else if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stories.length, onClose]);

  // অটোমেটিক স্লাইড চেঞ্জ (ডেমো টাইমার)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 7000); // ৭ সেকেন্ড পর পর
    return () => clearTimeout(timer);
  }, [currentIndex]);


  return (
    <>
      {/* 1. Backdrop Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* 2. Main Modal Content */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {/* Close Button (Top Right) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Navigation Arrows */}
        <button onClick={goToPrev} className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-50 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors">
          <ChevronLeft size={28} />
        </button>
        <button onClick={goToNext} className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-50 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors">
          <ChevronRight size={28} />
        </button>

        {/* Reel Wrapper (সেন্টারড) */}
        <div className="w-full sm:w-[360px] h-full max-h-[800px] aspect-[9/16] relative bg-zinc-950 overflow-hidden rounded-2xl shadow-2xl">
          
          {/* Progress Bar (Timer) */}
          <div className="absolute top-2 left-2 right-2 h-1 bg-white/30 rounded-full z-30">
            <motion.div 
              className="h-full bg-white" 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 7, ease: 'linear' }} // ৭ সেকেন্ডের টাইমার
              key={currentIndex} // স্টোরি বদলালে টাইমার রিসেট হবে
            />
          </div>

          {/* Top Info (আপনার শপের লোগো এবং নাম) */}
          <div className="absolute top-5 left-4 right-4 z-30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image 
                src={mainProfile.logo} // আপনার মেইন লোগো
                width={32} height={32} 
                alt={mainProfile.name} 
                className="w-8 h-8 rounded-full object-cover" 
              />
              <span className="font-semibold text-white text-sm text-shadow-md">{mainProfile.name}</span>
            </div>
          </div>
          
          {/* Main Background Image (বর্তমান স্টোরির ছবি) */}
          <Image
            src={currentStory.imageUrl}
            alt={currentStory.name}
            fill
            style={{ objectFit: 'cover' }}
            className="z-10"
            key={currentIndex}
          />

          {/* Bottom Gradient & Shop Button */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 z-30">
            {/* ছবির মতো টেক্সট (স্টোরির নাম) */}
            <h2 className="text-2xl font-bold text-white text-shadow-lg mb-4">{currentStory.name}</h2>
            
            <Link 
              href={currentStory.href} // এই ক্যাটাগরির লিঙ্কে যাবে
              className="block w-full bg-green-600 text-white font-bold py-3 px-5 rounded-lg text-lg text-center transition-transform hover:scale-105"
            >
              Shop Now &gt;
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};


// --- মূল স্টোরি ফিড কম্পোনেন্ট ---
const StoryCategories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedStoryIndex(index);
  };

  const closeModal = () => {
    setSelectedStoryIndex(null);
  };

  // আপনার ওয়েবসাইটের মেইন প্রোফাইল (সব স্টোরিতে এটাই দেখাবে)
  const mainProfile = {
    name: "My Organic Shop", // আপনার শপের নাম
    logo: "https://i.ibb.co/vxsq679p/Gemini-Generated-Image-deyncbdeyncbdeyn-removebg-preview.png" // আপনার লোগো
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse by Story
        </h2>
        
        <motion.div 
          ref={scrollRef} 
          className="overflow-x-auto cursor-grab py-2"
          style={{ scrollbarWidth: 'none' }} 
        >
          <motion.div
            className="flex flex-nowrap w-max gap-3 md:gap-4"
            drag="x"
            dragConstraints={scrollRef}
            dragElastic={0.1}
          >
         
            
            {storyData.map((story, index) => (
              <StoryCard 
                key={story.id} 
                {...story} 
                onClick={() => openModal(index)}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* --- মোডাল রেন্ডার করা --- */}
      <AnimatePresence>
        {selectedStoryIndex !== null && (
          <StoryViewerModal
            stories={storyData}
            startIndex={selectedStoryIndex}
            onClose={closeModal}
            mainProfile={mainProfile} // আপনার শপের তথ্য পাস করা হলো
          />
        )}
      </AnimatePresence>

    </section>
  );
};

export default StoryCategories;