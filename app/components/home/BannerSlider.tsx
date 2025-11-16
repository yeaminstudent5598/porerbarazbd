'use client';

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
    // কন্টেইনার থেকে padding (px-4 md:px-6) বাদ দেয়া হলো 
    // যাতে ব্যানারটি পুরো স্ক্রিন জুড়ে থাকে।
    <section className="mt-0">
      <div className="relative rounded-lg overflow-hidden">
        <Slider {...settings}>
          {bannerData.map((banner) => (
            <div 
              key={banner.id} 
              /* পরিবর্তন এখানে:
                w-full = পুরো প্রস্থ নিবে।
                aspect-[1200/400] = ছবির অনুপাত (৩:১) ঠিক রাখবে।
                max-h-[450px] = খুব বড় স্ক্রিনেও যেন ৪৫০px এর বেশি লম্বা না হয়।
              */
              className="relative w-full aspect-[1200/400] max-h-[450px]"
            >
              <Link href={banner.link} aria-label={banner.altText}>
                <Image
                  src={banner.imageUrl}
                  alt={banner.altText}
                  fill
                  priority
                 style={{ objectFit: 'cover', objectPosition: 'center' }}
                  // rounded-lg ক্লাসটি ইমেজ থেকে সরানো হয়েছে 
                  // কারণ এটি এখন প্যারেন্ট div-এ আছে।
                  className="cursor-pointer" 
                />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default StaticBannerGrid;