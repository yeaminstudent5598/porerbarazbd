// app/(main)/products/page.tsx
'use client'; // Required for useState, motion, client components like Slider/Checkbox

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// shadcn/ui Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ProductCard Component
import { ListFilter, LayoutGrid, X } from 'lucide-react'; // Icons
import { ProductCard } from '@/app/components/shared/ProductCard';

// Demo Data (Replace with fetching logic)
const allProducts = [
  { id: 1, name: "কালোজিরা আচার", imageUrl: "https://efoodis.com/public/uploads/product/1756417513-%E0%A6%95%E0%A6%BE%E0%A6%B2%E0%A7%8B%E0%A6%9C%E0%A6%BF%E0%A6%B0%E0%A6%BE-%E0%A6%AE%E0%A6%BF%E0%A6%95%E0%A7%8D%E0%A6%B8-%E0%A6%86%E0%A6%9A%E0%A6%BE%E0%A6%B0.jpg", oldPrice: 1250, newPrice: 890, discount: "29%", category: "Achar" },
  { id: 2, name: "ঝুড়ি পিঠা", imageUrl: "https://efoodis.com/public/uploads/product/1754690259-juri.webp", oldPrice: 850, newPrice: 790, discount: "7%", category: "Pitha" },
  { id: 3, name: "রসুনের আচার", imageUrl: "https://efoodis.com/public/uploads/product/1754690259-juri.webp", oldPrice: 850, newPrice: 690, discount: "19%", category: "Achar" },
  { id: 4, name: "১ কিজিঃ ৪ পিঠা কম্বো", imageUrl: "https://efoodis.com/public/uploads/product/1758055563-combo-offer.jpg", oldPrice: 990, newPrice: 690, discount: "30%", category: "Pitha" },
  { id: 5, name: "ঝিনুক পিঠা", imageUrl: "https://efoodis.com/public/uploads/product/1756499233-jhinuk-pitha.jpg", oldPrice: 850, newPrice: 590, discount: "31%", category: "Pitha" },
  { id: 7, name: "১.৫ লিটার ৪ স্পেশাল কম্বো", imageUrl: "https://efoodis.com/public/uploads/product/1758059095-combo-web-efoodis.jpg", oldPrice: 1800, newPrice: 1250, discount: "31%", category: "Oil" },
  { id: 12, name: "অর্গানিক সরিষার তেল", imageUrl: "https://efoodis.com/public/uploads/category/1736429963-organic.webp", oldPrice: 500, newPrice: 450, discount: "10%", category: "Oil" },
  // Add more products...
];

const categories = ["Pitha", "Achar", "Nuts & Dates", "Organic Spices", "Oil", "Super Foods", "Sweeteners & Dairy"];

// Grid Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  }
};

// --- FilterSidebar Component (defined within ProductsPage or imported) ---
const FilterSidebar = ({ priceRange, setPriceRange }: { priceRange: number[]; setPriceRange: (value: number[]) => void }) => (
  <div className="space-y-6">
    {/* Category Filter */}
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-3">
            <Checkbox id={category} onCheckedChange={(checked) => console.log(category, checked)} /> {/* TODO: Add filter logic */}
            <label
              htmlFor={category}
              className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {category}
            </label>
          </div>
        ))}
      </div>
    </div>

    <Separator />

    {/* Price Range Filter */}
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Price Range</h3>
      <Slider
        defaultValue={[0, 2000]}
        value={priceRange}
        max={5000}
        step={100}
        onValueChange={setPriceRange}
        className="my-4"
      />
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span>৳ {priceRange[0]}</span>
        <span>৳ {priceRange[1]}</span>
      </div>
    </div>

    <Separator />

    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => console.log("Applying filters...")}> {/* TODO: Add apply filter logic */}
      Apply Filters
    </Button>
  </div>
);
// --- End FilterSidebar Component ---


// --- Main ProductsPage Component ---
export default function ProductsPage() { // <--- নিশ্চিত করুন export default আছে
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);

  // TODO: Implement actual filtering logic
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">

        {/* Page Title and Sort Dropdown */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 border-b pb-4"> {/* Added border */}
          <h1 className="text-3xl font-bold text-gray-900">সকল পণ্য</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select onValueChange={(value) => console.log("Sort by:", value)}> {/* TODO: Add sort logic */}
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by: Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Sort by: Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="latest">Latest Products</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="md:hidden flex-shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <ListFilter size={20} className="mr-2 md:mr-0" /> <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Filter Sidebar (Desktop) */}
          <aside className="w-full md:w-1/4 lg:w-1/5 hidden md:block bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24 self-start"> {/* Added self-start */}
            <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} />
          </aside>

          {/* Mobile Filter Sidebar */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                />
                <motion.aside
                  className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white p-6 z-50 overflow-y-auto md:hidden shadow-xl"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-xl font-semibold">Filters</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                      <X size={24} />
                    </Button>
                  </div>
                  <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <LayoutGrid size={48} className="mx-auto mb-4"/>
                <p className="text-xl">No products found matching your filters.</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" // Adjusted grid
                variants={containerVariants}
                initial="hidden"
                animate="visible" // Use animate instead of whileInView if you want it always animated
                layout
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
             {/* TODO: Add Pagination */}
          </main>
        </div>
      </div>
    </section>
  );
} // <--- নিশ্চিত করুন ফাংশন বডি এখানে শেষ হচ্ছে