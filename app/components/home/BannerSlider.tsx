'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const bannerData = [
  {
    id: 1,
    imageUrl: "https://i.ibb.co.com/PsVdzbF7/Gemini-Generated-Image-rlb5fmrlb5fmrlb5.png",
    altText: "যা লাগবে, সবাই পাবে শুভধন অ্যাপে!",
    link: "/",
  },
  {
    id: 2,
    imageUrl: "https://i.ibb.co.com/KRb2zK7/Web-Bannar-Artboard-1.jpg",
    altText: "স্মার্ট উপায়ে কেনাকাটা করুন",
    link: "/",
  },
  {
    id: 3,
    imageUrl: "https://i.ibb.co.com/VnVKsQ3/Web-Bannar-Artboard-3.jpg",
    altText: "ডেলিভারি আপনার দোরগোড়ায়",
    link: "/",
  },
];

const smallBanners = [
  {
    id: 4,
    imageUrl: "https://i.ibb.co.com/HLsbnyYR/Gemini-Generated-Image-ux5svqux5svqux5s.png",
    altText: "বেস্ট-ডিলস নতুন সুযোগ তৈরি",
    link: "/offers",
  },
  {
    id: 5,
    imageUrl: "https://i.ibb.co.com/7dZfngLj/Gemini-Generated-Image-g2grvpg2grvpg2gr.png",
    altText: "আপনার ছোট একটি দান বদলে দিবে কারোও দিন!",
    link: "/donate",
  },
];

const StaticBannerGrid = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
  };

  return (
    <section className="container mx-auto mt-10 mb-10 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* বাম পাশে স্লাইডার */}
        <div className="lg:col-span-2 relative h-[300px] md:h-[400px] lg:h-[550px] overflow-hidden rounded-lg shadow-lg">
          <Slider {...settings}>
            {bannerData.map((banner) => (
              <div key={banner.id} className="relative h-[300px] md:h-[400px] lg:h-[550px]">
                <Link href={banner.link} aria-label={banner.altText}>
                  <Image
                    src={banner.imageUrl}
                    alt={banner.altText}
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className="rounded-lg cursor-pointer"
                  />
                </Link>
              </div>
            ))}
          </Slider>
        </div>

        {/* ডান পাশে ছোট দুইটা ব্যানার */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          {smallBanners.map((banner) => (
            <div
              key={banner.id}
              className="relative h-[180px] md:h-[220px] lg:h-[265px] overflow-hidden rounded-lg shadow-lg group"
            >
              <Link href={banner.link} aria-label={banner.altText}>
                <Image
                  src={banner.imageUrl}
                  alt={banner.altText}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="transition-transform duration-500 ease-in-out group-hover:scale-105 cursor-pointer"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaticBannerGrid;
