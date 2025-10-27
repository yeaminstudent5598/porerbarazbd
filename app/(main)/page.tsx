// src/app/(main)/page.tsx
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryShop from '../components/home/CategoryShop';
import WhyChooseUs from '../components/home/features/WhyChooseUs';
import Bestsellers from '../components/home/bestsellers/Bestsellers';
import Deals from '../components/home/dealsOfTheDay/Deals';
import OurProcess from '../components/home/process/OurProcess';
import Testimonials from '../components/home/testimonials/Testimonials';
import BannerSlider from '../components/home/BannerSlider';
import HomeBanners from '../components/home/BannerSlider';


// This is likely a Server Component by default in App Router
export default function HomePage() {
  return (
    // Optional: Add a top-level div if needed, otherwise React.Fragment is fine
    <>
      {/* <HeroSection /> */}
      {/* <BannerSlider/> */}
      <HomeBanners/>
      <CategoryShop />
      <WhyChooseUs />
      <Bestsellers />
      <Deals /> {/* This might be your "All Products" section for the homepage */}
      <OurProcess />
      <Testimonials />
    </>
  );
}