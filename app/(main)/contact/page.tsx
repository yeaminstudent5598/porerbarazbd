// app/(main)/contact/page.tsx
'use client'; // Required for form handling (onSubmit)

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from 'lucide-react'; // Icons

// --- ContactPage Component ---
export default function ContactPage() { // <--- নিশ্চিত করুন export default আছে

  // Demo form submit handler
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement form submission logic (e.g., send data to API)
    console.log("Form submitted...");
    alert("Message Sent! We will get back to you soon.");
    // Optionally reset the form
    // event.currentTarget.reset();
  };

  return (
    <section className="py-16 bg-white min-h-[80vh]"> {/* White background, min height */}
      <div className="container mx-auto px-4">

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900">
            যোগাযোগ করুন
          </h2>
          <p className="text-gray-600 mt-3 text-lg max-w-xl mx-auto"> {/* Added max-width */}
            আপনার যেকোনো প্রশ্ন, মতামত বা অভিযোগ আমাদের জানান। আমরা সাহায্য করতে প্রস্তুত।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"> {/* Added items-start */}

          {/* ===== Contact Form ===== */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              আমাদের মেসেজ পাঠান
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div>
                <Label htmlFor="name" className="font-medium text-gray-700">আপনার নাম</Label>
                <Input
                  type="text"
                  id="name"
                  name="name" // Add name attribute
                  placeholder="আপনার সম্পূর্ণ নাম"
                  className="mt-2"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="font-medium text-gray-700">আপনার ইমেইল</Label>
                <Input
                  type="email"
                  id="email"
                  name="email" // Add name attribute
                  placeholder="example@email.com"
                  className="mt-2"
                  required
                />
              </div>

              {/* Subject Input */}
              <div>
                <Label htmlFor="subject" className="font-medium text-gray-700">বিষয়</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject" // Add name attribute
                  placeholder="আপনার বার্তার বিষয়"
                  className="mt-2"
                  required
                />
              </div>

              {/* Message Textarea */}
              <div>
                <Label htmlFor="message" className="font-medium text-gray-700">আপনার বার্তা</Label>
                <Textarea
                  id="message"
                  name="message" // Add name attribute
                  placeholder="আপনার বিস্তারিত বার্তা এখানে লিখুন..."
                  className="mt-2"
                  rows={5} // Adjusted rows
                  required
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-base">
                মেসেজ পাঠান <Send size={18} className="ml-2" />
              </Button>
            </form>
          </div>

          {/* ===== Contact Information ===== */}
          <div className="space-y-8 mt-4 md:mt-0">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              সরাসরি যোগাযোগ
            </h3>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-green-100 p-4 rounded-full">
                <Phone size={24} className="text-green-700" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800">ফোন</h4>
                <p className="text-sm sm:text-base text-gray-600 mb-1">যেকোনো তথ্যের জন্য কল করুন (সকাল ১০টা - রাত ৮টা)</p>
                {/* TODO: Update with your phone number */}
                <a
                  href="tel:+8801716342167"
                  className="text-base sm:text-lg font-medium text-green-700 hover:underline"
                >
                  +8801716342167
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-green-100 p-4 rounded-full">
                <Mail size={24} className="text-green-700" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800">ইমেইল</h4>
                <p className="text-sm sm:text-base text-gray-600 mb-1">যেকোনো সাপোর্টের জন্য আমাদের ইমেইল করুন</p>
                 {/* TODO: Update with your email */}
                <a
                  href="mailto:support@porerbazarbd.com"
                  className="text-base sm:text-lg font-medium text-green-700 hover:underline"
                >
                  support@porerbazarbd.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-green-100 p-4 rounded-full">
                <MapPin size={24} className="text-green-700" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800">অফিসের ঠিকানা</h4>
                {/* TODO: Update with your address */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  হাউস #১২৩, রোড #৪, ব্লক #বি <br/>
                  বসুন্ধরা আর/এ, ঢাকা-১২২৯, বাংলাদেশ
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
} // <--- নিশ্চিত করুন ফাংশন বডি এখানে শেষ হচ্ছে