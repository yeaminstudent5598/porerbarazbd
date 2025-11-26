// src/components/shared/Footer.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link'; // Use Next.js Link
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Send
} from 'lucide-react';

// Category links (same as Navbar)
const categories = [
  { name: 'Pitha', href: '/category/pitha' },
  { name: 'Achar', href: '/category/achar' },
  { name: 'Nuts & Dates', href: '/category/nuts-dates' },
  { name: 'Organic Spices', href: '/category/organic-spices' },
  { name: 'Organic Oil', href: '/category/organic-oil' },
  { name: 'Rice, Pulse', href: '/category/rice-pulse' },
];

// Quick links (points to pages)
const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'All Products', href: '/products' },
  { name: 'Track Order', href: '/dashboard/orders' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8"> {/* Darker Background */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              {/* TODO: Use your white/light logo */}
              <img
                src="/logo-white.png" // Assumes logo-white.png is in public folder
                alt=" Shotej Foods  "
                className="h-12 mb-4" // Adjust height
                width={140} // Add width
                height={48} // Add height
              />
            </Link>
            <p className="text-sm leading-relaxed">
              গ্রামীণ ঐতিহ্যে সতেজফুডস অনলাইন শপে আপনাকে স্বাগতম। বিশ্বস্ততার সাথে সারা বাংলাদেশে খাঁটি ও অর্গানিক পণ্যের হোম ডেলিভারী দিয়ে থাকি।
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-green-400 mt-1 flex-shrink-0" />
                {/* TODO: Add your actual address */}
                <span className="text-sm">House #123, Road #4, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-sm hover:text-white transition-colors">
                   {/* TODO: Add your actual phone number */}
                  <a href="tel:+8801716342167">+8801716342167</a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-sm hover:text-white transition-colors">
                  {/* TODO: Add your actual email */}
                  <a href="mailto:support@ShotejFoods.com">support@ShotejFoods .com</a>
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:pl-8">
            <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white hover:pl-2 transition-all duration-300 text-sm">
                     › {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Top Categories</h3>
            <ul className="space-y-3">
              {categories.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white hover:pl-2 transition-all duration-300 text-sm">
                    › {link.name}
                  </Link>
                </li>
              ))}
               <li key="all-cat">
                  <Link href="/products" className="hover:text-white hover:pl-2 transition-all duration-300 text-sm font-medium text-green-300 mt-2 inline-block">
                    › View All Categories
                  </Link>
                </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm mb-4">
              অফার এবং নতুন পণ্যের আপডেট পেতে সাবস্ক্রাইব করুন।
            </p>
            {/* TODO: Implement Newsletter subscription logic */}
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-700 border-gray-600 text-white rounded-r-none focus-visible:ring-green-500 focus-visible:ring-offset-0 placeholder:text-gray-400"
                required
              />
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-l-none" aria-label="Subscribe">
                <Send size={18} />
              </Button>
            </form>

            <h3 className="text-lg font-semibold text-white mt-8 mb-4 uppercase tracking-wider">Follow Us</h3>
            <div className="flex space-x-4">
              {/* TODO: Add your actual social media links */}
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 bg-gray-700 rounded-full hover:bg-green-600 transition-colors"> <Facebook size={20} /> </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-gray-700 rounded-full hover:bg-green-600 transition-colors"> <Instagram size={20} /> </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 bg-gray-700 rounded-full hover:bg-green-600 transition-colors"> <Youtube size={20} /> </a>
            </div>
          </div>

        </div>

        {/* --- Bottom Bar --- */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()}  Shotej Foods  . All Rights Reserved.
            Developed by <a href="https://pixelandcodeweb.vercel.app/" className="font-medium text-green-400 hover:text-white" target="_blank" rel="noopener noreferrer">Pixel & Code</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;