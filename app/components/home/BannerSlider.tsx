// src/components/home/StaticBannerGrid.tsx
'use client'; // যদি কোনো ইন্টারঅ্যাক্টিভ অ্যানিমেশন বা ক্লায়েন্ট-সাইড স্টেট থাকে, তাহলে এটি দরকার

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const bannerData = [
  {
    id: 1,
    imageUrl: "https://i.ibb.co.com/PsVdzbF7/Gemini-Generated-Image-rlb5fmrlb5fmrlb5.png", // বাম পাশের বড় ব্যানার
    altText: "যা লাগবে, সবাই পাবে শুভধন অ্যাপে!",
    link: "/download-app", // উদাহরণ লিঙ্ক
    isMain: true, // এটি প্রধান ব্যানার নির্দেশ করে
  },
  {
    id: 2,
    imageUrl: "https://i.ibb.co.com/HLsbnyYR/Gemini-Generated-Image-ux5svqux5svqux5s.png", // ডান দিকের উপরের ছোট ব্যানার
    altText: "বেস্ট-ডিলস নতুন সুযোগ তৈরি",
    link: "/offers", // উদাহরণ লিঙ্ক
    isMain: false,
  },
  {
    id: 3,
    imageUrl: "https://i.ibb.co.com/7dZfngLj/Gemini-Generated-Image-g2grvpg2grvpg2gr.png", // ডান দিকের নিচের ছোট ব্যানার
    altText: "আপনার ছোট একটি দান বদলে দিবে কারোও দিন!",
    link: "/donate",
    isMain: false,
  },
];

const StaticBannerGrid = () => {
  return (
    <section className="container mx-auto mt-10 mb-10 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* বাম দিকের বড় ব্যানার */}
        <div className="lg:col-span-2 relative h-[300px] md:h-[400px] lg:h-[550px] overflow-hidden rounded-lg shadow-lg group">
          <Link href={bannerData[0].link} aria-label={bannerData[0].altText}>
            <Image
              src={bannerData[0].imageUrl}
              alt={bannerData[0].altText}
              fill
              priority // প্রধান ব্যানার দ্রুত লোড হোক
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className="transition-transform duration-500 ease-in-out group-hover:scale-105 cursor-pointer"
            />
          </Link>
        </div>

        {/* ডান দিকের দুটি ছোট ব্যানার */}
        <div className="grid grid-cols-1 gap-4">
          {bannerData.slice(1).map((banner) => ( // প্রথম ব্যানারটি বাদ দিয়ে বাকিগুলো ম্যাপ করা হয়েছে
            <div key={banner.id} className="relative h-[250px] md:h-[200px] lg:h-[265px] overflow-hidden rounded-lg shadow-lg group">
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