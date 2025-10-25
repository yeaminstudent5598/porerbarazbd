// src/components/home/CategoryShop.tsx
'use client'; // motion requires client component

import React, { useEffect } from 'react';
import { motion, useAnimationControls, AnimationControls } from "framer-motion";
import Link from 'next/link';

// === Category Data ===
// Desktop (Full List)
const categoriesDesktop = [
  { name: "Nuts & Dates", href: "/category/nuts-dates", imageUrl: "https://efoodis.com/public/uploads/category/1736429753-screenshot_2.webp" },
  { name: "Organic Spices", href: "/category/organic-spices", imageUrl: "https://efoodis.com/public/uploads/category/1736429674-images.webp" },
  { name: "Organic Oil", href: "/category/organic-oil", imageUrl: "https://efoodis.com/public/uploads/category/1736429963-organic.webp" },
  { name: "Rice, Pulse", href: "/category/rice-pulse", imageUrl: "https://efoodis.com/public/uploads/category/1736430207-rice.webp" },
  { name: "Super Foods", href: "/category/super-foods", imageUrl: "https://efoodis.com/public/uploads/category/1736430103-dal.webp" },
  { name: "Sweeteners & Dairy", href: "/category/sweeteners-dairy", imageUrl: "https://efoodis.com/public/uploads/category/1736430546-swee.webp" },
  { name: "Pitha", href: "/category/pitha", imageUrl: "https://efoodis.com/public/uploads/category/1736429456-ghee-concept-shot.webp" }
];
// Mobile (Split)
const categoriesMobileRow1 = categoriesDesktop.slice(0, Math.ceil(categoriesDesktop.length / 2)); // First half
const categoriesMobileRow2 = categoriesDesktop.slice(Math.ceil(categoriesDesktop.length / 2)); // Second half

// === Category Item Interface ===
interface CategoryItemProps {
    name: string;
    href: string;
    imageUrl: string;
    ariaHidden?: boolean;
}

// === Desktop Item Component ===
const DesktopCategoryItem: React.FC<CategoryItemProps> = ({ name, href, imageUrl, ariaHidden = false }) => (
  <Link
    href={href}
    className="flex-shrink-0 w-44 md:w-48 text-center group"
    aria-hidden={ariaHidden}
  >
    <motion.div
      className="w-36 h-36 md:w-40 md:h-40 mx-auto rounded-full border-4 border-green-700 overflow-hidden group-hover:border-green-800 group-hover:shadow-xl"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" loading="lazy" width={160} height={160}/>
    </motion.div>
    <h3 className="mt-4 font-semibold text-gray-800 text-base md:text-lg group-hover:text-green-700 transition-colors">
      {name}
    </h3>
  </Link>
);

// === Mobile Item Component ===
const MobileCategoryItem: React.FC<CategoryItemProps> = ({ name, href, imageUrl, ariaHidden = false }) => (
  <Link
    href={href}
    className="flex-shrink-0 w-28 text-center group"
    aria-hidden={ariaHidden}
  >
    <motion.div
        className="w-24 h-24 mx-auto rounded-full border-4 border-green-700 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
     >
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" loading="lazy" width={96} height={96}/>
    </motion.div>
    <h3 className="mt-3 font-semibold text-gray-800 text-sm group-hover:text-green-700 transition-colors">
      {name}
    </h3>
  </Link>
);

// Animation Variants
const marqueeLeftVariants = {
  animate: { x: "-50%", transition: { duration: 40, repeat: Infinity, repeatType: "loop", ease: "linear" } }
};
const marqueeRightVariants = {
  initial: { x: "-50%" },
  animate: { x: "0%", transition: { duration: 40, repeat: Infinity, repeatType: "loop", ease: "linear" } }
};

// === Marquee Row Component ===
interface MarqueeRowProps {
    items: CategoryItemProps[];
    direction: 'left' | 'right';
    controls: AnimationControls;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    ItemComponent: React.FC<CategoryItemProps>;
    itemPaddingClass: string;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, direction, controls, onMouseEnter, onMouseLeave, ItemComponent, itemPaddingClass }) => (
    <div
      className="w-full overflow-hidden"
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onMouseEnter} // Pause on touch
      onTouchEnd={onMouseLeave}   // Resume on touch end
    >
      <motion.div
        className="flex flex-nowrap w-max"
        variants={direction === 'left' ? marqueeLeftVariants : marqueeRightVariants}
        initial={direction === 'right' ? "initial" : undefined} // Only set initial for right scroll
        animate={controls}
      >
        {/* Repeat items twice for seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div key={`${direction}-${index}`} className={itemPaddingClass}>
            <ItemComponent {...item} ariaHidden={index >= items.length} />
          </div>
        ))}
      </motion.div>
    </div>
);


const CategoryShop = () => {
  const controlsDesktop = useAnimationControls();
  const controlsMobile1 = useAnimationControls();
  const controlsMobile2 = useAnimationControls();

  useEffect(() => { controlsDesktop.start("animate"); }, [controlsDesktop]);
  useEffect(() => { controlsMobile1.start("animate"); }, [controlsMobile1]);
  useEffect(() => { controlsMobile2.start("animate"); }, [controlsMobile2]);

  const handleMouseEnterDesktop = () => controlsDesktop.stop();
  const handleMouseLeaveDesktop = () => controlsDesktop.start("animate");
  const handleMouseEnterMobile1 = () => controlsMobile1.stop();
  const handleMouseLeaveMobile1 = () => controlsMobile1.start("animate");
  const handleMouseEnterMobile2 = () => controlsMobile2.stop();
  const handleMouseLeaveMobile2 = () => controlsMobile2.start("animate");

  return (
    <section className="w-full py-12 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Top Categories
        </h2>

        {/* Desktop View (md and larger) */}
        <div className="hidden md:block">
           <MarqueeRow
             items={categoriesDesktop}
             direction="left"
             controls={controlsDesktop}
             onMouseEnter={handleMouseEnterDesktop}
             onMouseLeave={handleMouseLeaveDesktop}
             ItemComponent={DesktopCategoryItem}
             itemPaddingClass="px-4"
           />
        </div>

        {/* Mobile View (smaller than md) */}
        <div className="block md:hidden space-y-4">
          {/* Mobile Row 1 (Left scroll) */}
          <MarqueeRow
             items={categoriesMobileRow1}
             direction="left"
             controls={controlsMobile1}
             onMouseEnter={handleMouseEnterMobile1}
             onMouseLeave={handleMouseLeaveMobile1}
             ItemComponent={MobileCategoryItem}
             itemPaddingClass="px-2"
           />

          {/* Mobile Row 2 (Right scroll) */}
           <MarqueeRow
             items={categoriesMobileRow2}
             direction="right"
             controls={controlsMobile2}
             onMouseEnter={handleMouseEnterMobile2}
             onMouseLeave={handleMouseLeaveMobile2}
             ItemComponent={MobileCategoryItem}
             itemPaddingClass="px-2"
           />
        </div>
      </div>
    </section>
  );
};

export default CategoryShop;