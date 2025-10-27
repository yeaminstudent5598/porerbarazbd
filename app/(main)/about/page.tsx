// app/(main)/about/page.tsx
'use client'; // motion requires client component

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, HeartHandshake, Truck, Wheat, Droplet, Users } from 'lucide-react'; 

// Values section data
const ourValues = [
  { icon: <Leaf size={32} className="text-green-600" />, title: "খাঁটি ও প্রাকৃতিক", description: "আমরা সরাসরি গ্রাম থেকে প্রাকৃতিক উপায়ে উৎপাদিত পণ্য সংগ্রহ করি, যা কোনো ক্ষতিকর রাসায়নিক মুক্ত।" },
  { icon: <HeartHandshake size={32} className="text-green-600" />, title: "কৃষকের সাথে সরাসরি সংযোগ", description: "মধ্যস্বত্বভোগী বাদ দিয়ে আমরা সরাসরি কৃষকের কাছ থেকে ন্যায্য মূল্যে পণ্য কিনি, যা কৃষকের জীবনমান উন্নত করে।" },
  { icon: <Award size={32} className="text-green-600" />, title: "গুণগত মানের নিশ্চয়তা", description: "প্রতিটি পণ্য আমাদের নিজস্ব মান নিয়ন্ত্রণ টিমের মাধ্যমে পরীক্ষা করা হয়। আমরা স্বাদের সাথে মানের কোনো আপস করি না।" },
  { icon: <Truck size={32} className="text-green-600" />, title: "সতেজ ও দ্রুত ডেলিভারি", description: "আমরা পণ্যের সতেজতা ধরে রাখতে দ্রুততম সময়ে স্বাস্থ্যসম্মত উপায়ে আপনার দোরগোড়ায় পৌঁছে দিই।" }
];

// ===================================
// === অ্যানিমেশন ভেরিয়েন্ট (সংশোধিত) ===
// ===================================
const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    // --- transition অবজেক্টটি whileInView-এর ভেতরে আনা হয়েছে ---
    transition: { 
      duration: 0.7, 
      ease: "easeOut" as const // (ঐচ্ছিক: "as const" টাইপকে আরও স্ট্রিক্ট করে)
    }
  },
  viewport: { once: true, amount: 0.2 }
};
// ===================================


// --- AboutPage Component ---
export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ===== Hero Section ===== */}
      <section
        className="relative py-20 md:py-32 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070')" }}
        aria-labelledby="about-hero-heading"
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            id="about-hero-heading"
            className="text-4xl md:text-6xl font-extrabold text-white text-shadow-lg"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            আমাদের সম্পর্কে
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl mx-auto text-shadow-md"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          >
            গ্রামীণ ঐতিহ্যের শেকড় থেকে আপনার রান্নাঘরে খাঁটি স্বাদের যোগসূত্র।
          </motion.p>
        </div>
      </section>

      {/* ===== Our Story Section ===== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* ...fadeIn এখন সঠিকভাবে কাজ করবে */}
            <motion.div {...fadeIn}>
              <img
                src="https://i.pinimg.com/1200x/ee/47/10/ee4710fe39b2b8b0af5a67e516ccfcb4.jpg"
                alt="গ্রামীণ ঐতিহ্য"
                className="rounded-lg shadow-xl object-cover w-full h-auto max-h-[500px]"
                width={600} height={500}
              />
            </motion.div>
            {/* ...fadeIn এখন সঠিকভাবে কাজ করবে */}
            <motion.div {...fadeIn}>
              <span className="font-semibold text-green-600 text-lg">আমাদের গল্প</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                শেকড়ের সন্ধানে <span className="text-green-700">Porer Bazar BD</span>
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  শহুরে জীবনের ব্যস্ততায় আমরা অনেকেই হারিয়ে ফেলছি আমাদের গ্রামীণ ঐতিহ্য আর খাঁটি খাবারের স্বাদ। মেশিনের ভিড়ে চাপা পড়ে যাচ্ছে ঢেঁকি ছাঁটা চালের গন্ধ, ঘানিতে ভাঙা তেলের ঝাঁঝ, কিংবা বাড়ির উঠোনে বানানো পিঠার আমেজ। Porer Bazar BD-এর জন্ম সেই হারানো স্বাদ ও স্মৃতি ফিরিয়ে আনার একটি আন্তরিক প্রচেষ্টা থেকে।
                </p>
                <p>
                  আমরা বিশ্বাস করি, ভালো খাবারের শুরু হয় তার উৎস থেকে। তাই আমরা বাংলাদেশের বিভিন্ন প্রান্তের গ্রামগুলোতে যাই, মিশে যাই সেখানকার সাধারণ মানুষগুলোর সাথে। খুঁজে বের করি সেইসব কৃষক ও কারিগরদের, যারা আজও পূর্বপুরুষদের শেখানো পদ্ধতিতেই পরম যত্নে খাঁটি পণ্য তৈরি করছেন – হোক তা হাতে ভাজা মুড়ি, শিলাপাটা বাটা মশলা, বা লাকড়ির চুলায় বানানো আচার।
                </p>
                <p>
                  আমাদের লক্ষ্য শুধু খাঁটি পণ্য বিক্রি করা নয়, বরং শহরের যান্ত্রিক জীবনের সাথে গ্রামের সেই সহজ-সরল, স্নিগ্ধ জীবনধারা আর শত বছরের ঐতিহ্যের একটি সেতুবন্ধন তৈরি করা। প্রতিটি Porer Bazar BD পণ্যের সাথে আমরা চেষ্টা করি সেই মাটির গন্ধ আর মানুষের মমতাটুকু আপনার কাছে পৌঁছে দিতে।
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Rural Traditions Section ===== */}
      <section className="py-16 md:py-24 bg-green-50/50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <span className="font-semibold text-green-700 text-lg">আমাদের বিশেষত্ব</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              গ্রামীণ ঐতিহ্যের <span className="text-green-700">খাঁটি ছোঁয়া</span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              আমরা শুধু পণ্য বিক্রি করি না, প্রতিটি পণ্যের সাথে জড়িয়ে থাকা গ্রামীণ ঐতিহ্যকেও তুলে ধরার চেষ্টা করি।
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div className="bg-white p-8 rounded-lg shadow-lg text-center border-b-4 border-yellow-600 hover:-translate-y-2 transition-transform" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
              <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4"> <Wheat size={40} className="text-yellow-700" /> </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">ঢেঁকি ছাঁটা চাল</h3>
              <p className="text-gray-600 text-sm">পুষ্টিগুণ অক্ষুণ্ণ রেখে ঐতিহ্যবাহী ঢেঁকিতে চাল ছাঁটা হয়, যা আধুনিক মেশিনে পাওয়া যায় না। এর স্বাদ ও গন্ধই আলাদা।</p>
            </motion.div>
            <motion.div className="bg-white p-8 rounded-lg shadow-lg text-center border-b-4 border-orange-600 hover:-translate-y-2 transition-transform" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
              <div className="inline-block p-4 bg-orange-100 rounded-full mb-4"> <Droplet size={40} className="text-orange-700" /> </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">ঘানিতে ভাঙা তেল</h3>
              <p className="text-gray-600 text-sm">ধীর গতিতে কাঠের ঘানিতে সরিষা বা অন্যান্য বীজ ভাঙার ফলে তেলের আসল স্বাদ, গন্ধ এবং পুষ্টিগুণ বজায় থাকে।</p>
            </motion.div>
            <motion.div className="bg-white p-8 rounded-lg shadow-lg text-center border-b-4 border-red-600 hover:-translate-y-2 transition-transform" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}>
              <div className="inline-block p-4 bg-red-100 rounded-full mb-4"> <HeartHandshake size={40} className="text-red-700" /> </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">হাতে গড়া মমতা</h3>
              <p className="text-gray-600 text-sm">আমাদের পিঠা ও আচার গ্রামের মহিলাদের হাতে তৈরি, যেখানে প্রতিটি উপাদানে মিশে থাকে যত্ন আর ভালোবাসা – ঠিক যেন বাড়ির খাবার।</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Farmer Spotlight Section ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <span className="font-semibold text-green-600 text-lg">আমাদের সহযোগী</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              মাটির মানুষ, খাঁটি কারিগর
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              তাদের শ্রম আর সততাই Porer Bazar BD-এর শক্তি। পরিচয় করিয়ে দিচ্ছি আমাদের কয়েকজন কৃষক ও কারিগরের সাথে।
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              { name: "রহিমা বেগম", village: "চাঁদপুর", product: "হাতে ভাজা মুড়ি ও চালের গুঁড়া", quote: "নিজের হাতে তৈরি করি, যেমন নিজের ঘরের জন্য বানাই। কোনো ভেজাল নাই。", img: "https://i.ibb.co/QvJDsG8y/Textbook-Travel-Currently-Exploring-The-Animal-Kingdom.jpg" },
              { name: "আব্দুল খালেক", village: "নওগাঁ", product: "অর্গানিক হলুদ ও মরিচের গুঁড়া", quote: "জমিতে কোনো সার-বিষ দেই না। যা হয়, আল্লার রহমতে ভালোই হয়।", img: "https://i.ibb.co/Dgj5tt94/Download-premium-image-of-Indian-farmer-doing-agriculture-vegetable-smiling-plant-about-indian-farme.jpg" },
              { name: "ফরিদা ইয়াসমিন", village: "বিক্রমপুর", product: "বিভিন্ন প্রকার আচার", quote: "শাশুড়ির কাছ থেকে শেখা রেসিপি। যত্ন করে বানাই, সবাই খুব পছন্দ করে।", img: "https://images.stockcake.com/public/f/0/2/f02a71da-9a50-4e0e-bd4d-0db5dd5b140c_medium/traditional-cooking-scene-stockcake.jpg" },
            ].map((person, index) => (
               <motion.div
                key={person.name}
                className="flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }} viewport={{ once: true }}
              >
                <img
                  src={person.img}
                  alt={person.name}
                  className="w-36 h-36 rounded-full object-cover mb-4 border-4 border-gray-200 shadow-md group-hover:border-green-400 transition-colors"
                  width={144} height={144}
                />
                <h3 className="text-xl font-semibold text-gray-800">{person.name}</h3>
                <p className="text-gray-500 text-sm">গ্রাম: {person.village}</p>
                <p className="mt-2 text-green-700 font-medium text-sm">{person.product}</p>
                <p className="mt-3 text-gray-600 italic text-sm">"{person.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Meet Our Team Section ===== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <span className="font-semibold text-green-600 text-lg">আমাদের চালিকাশক্তি</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              আমাদের নিবেদিত <span className="text-green-700">টিম</span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              একদল স্বপ্নবাজ মানুষের সম্মিলিত প্রচেষ্টা, যারা গ্রামের খাঁটি স্বাদ শহরে পৌঁছে দিতে বদ্ধপরিকর।
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "ইয়ামিন মাদবর", title: "প্রতিষ্ঠাতা", img: "https://scontent.fdac24-5.fna.fbcdn.net/v/t39.30808-6/509432432_1977168029754058_6770209236524440672_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEPeGWJzJS1LznRTfMl5Oh2xdc-8fK24ozF1z7x8rbijLC5NB5EDA3wtdCiSbgo4UfDxW7m_mk92djTm86b4H66&_nc_ohc=DAFnm5VlE-sQ7kNvwGHEj2T&_nc_oc=AdmlGiBiHaDuUCkKg_Te1rZuCezk5ykWlus2rYPgKXG9LWOuB9v83kCxVYEf8rO7X7w&_nc_zt=23&_nc_ht=scontent.fdac24-5.fna&_nc_gid=JgKXwS6uW386hSC2DRr_bA&oh=00_Afd4010Cy0ZpeMdZxNvmoaM_wXBFcSehcTBGnnLSRHmQLg&oe=68FD5151" },
              { name: "মোঃ মিজান", title: "সংগ্রহকারী", img: "https://scontent.fdac24-1.fna.fbcdn.net/v/t39.30808-6/484817937_2113263422438620_2586234141452055034_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGB_nwBDRQTXcbxINdE3TVmZptpu9VBLixmm2m71UEuLBNCQMGZp1jSYRlCnNh5vu5iV3_HQTUWE-xLAzi--Pae&_nc_ohc=xe25GgLe6x0Q7kNvwHJ1o0i&_nc_oc=AdlruXah-I0zKTbFyJ3bSLwdAJsbx-Q4GPTeBdcqP5wUDeAElRrdtp3HuNhTchjc1E8&_nc_zt=23&_nc_ht=scontent.fdac24-1.fna&_nc_gid=AU0yh1dl3C2EMs-ejMjXBA&oh=00_AffXFWMwCCGmZwOUwMQs47UHKoFaxHI1re6c3ZwbfvRaaA&oe=68FD3176" },
              { name: "ইউসুফ রহমান", title: "মান নিয়ন্ত্রণ", img: "https://scontent.fdac24-2.fna.fbcdn.net/v/t39.30808-6/481899771_1013994870595916_9149949265966877033_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGOX4QOfOAP45rF71eI_azjnpdZErGj-U2el1kSsaP5TdgovHC30fCz5RhlTwKDvKvftJiENjd9JE-cBKrXn9X6&_nc_ohc=e7hcAN_eXhYQ7kNvwE-uqXb&_nc_oc=AdkfDzx2RIXMrD35bziysX2jrsUDa8lnaLboOt-9GH6nD7PiLtz71jTtgFm60sNe7Wo&_nc_zt=23&_nc_ht=scontent.fdac24-2.fna&_nc_gid=XlAcjtIhrAQbYsheVhwMYQ&oh=00_AfeThw0aVX_jGGX0CfYTDhYgQ-5DCR42-8u8psYWbjXkhg&oe=68FD4A94" },
              { name: "মাহমুদুল এইচ মারুফ", title: "ডেলিভারি সমন্বয়ক", img: "https://scontent.fdac24-2.fna.fbcdn.net/v/t39.30808-6/481006126_1342102890576039_7977481923929653239_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGiC-FJssUp3h7xlptgpkNOOIX5vJ6luyo4hfm8nqW7Kml56M8INR13qHTdUwLj7VwWHTNMHLLGK9hbzXydxH0d&_nc_ohc=CuRhWpHtJ0QQ7kNvwGMaGIR&_nc_oc=AdmL8cWoHSoq8S1P401Wj0IGB6i4AMj9KNxW-G8ynbZAD3KM-0x5BmbQFZEcg_1wQMI&_nc_zt=23&_nc_ht=scontent.fdac24-2.fna&_nc_gid=Ektv3e9YkZGaW12z_Z3j3A&oh=00_Afep7Bup4au2xsiHX2CkWpCTp-mBs9wHx76-DaTxnm6b_w&oe=68FD3069" },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
              >
                <div className="relative inline-block">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-48 h-48 rounded-full object-cover mx-auto mb-4 border-4 border-gray-200 group-hover:border-green-500 transition-colors duration-300"
                    width={192} height={192}
                   />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-green-700 font-medium">{member.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Our Values Section ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <span className="font-semibold text-green-600 text-lg">আমাদের প্রতিশ্রুতি</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              কেন আমরা আলাদা?
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ourValues.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-lg text-center border-t-4 border-green-600 h-full flex flex-col hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm flex-grow"> {/* Added flex-grow */}
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}