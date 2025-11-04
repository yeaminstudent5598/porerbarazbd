'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"; // <-- ১. useSession ইম্পোর্ট করুন
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { ArrowLeft, Save, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'; // <-- Loader2 ইম্পোর্ট করুন
import { cn } from '@/app/lib/utils';
// import { useAuth } from '@/context/AuthContext'; // (এটির আর দরকার নেই)

// ... (Product state interface ও initialProductState অপরিবর্তিত)
interface NewProductState {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
  oldPrice?: string;
  discount?: string;
  weight?: string;
  ingredients?: string;
}

const initialProductState: NewProductState = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  status: 'Active',
};


export default function AddProductPage() {
  const router = useRouter();
  // const { token } = useAuth(); // (দরকার নেই)
  
  // <-- ২. NextAuth থেকে সেশন ডেটা নিন
  const { data: session, status } = useSession();

  const [productData, setProductData] = useState<NewProductState>(initialProductState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!imageFile) {
      setError("Product image is required.");
      return;
    }
    
    // <-- ৩. সেশন থেকে আসল টোকেনটি নিন
    const adminToken = session?.accessToken;

    // <-- ৪. টোকেন না থাকলে বা সেশন না থাকলে রিকোয়েস্ট পাঠাবেন না
    if (!adminToken) {
        setError("Authentication Error: No valid token found. Please log in again.");
        return;
    }
    
    setIsSubmitting(true);

    // ১. FormData তৈরি করা
    const formData = new FormData();
    formData.append('image', imageFile); // ছবি ফাইল
    
    // productData অবজেক্টের সব ডেটা FormData-তে যোগ করা
    (Object.keys(productData) as Array<keyof NewProductState>).forEach(key => {
        const value = productData[key];
        if (value) { 
            formData.append(key, value);
        }
    });

    try {
      // ২. API কল করা
      // const adminToken = "YOUR_ADMIN_AUTH_TOKEN_HERE"; // <-- এই ভুল লাইনটি ডিলিট করুন

      const response = await fetch('/api/products', { // আপনার POST API রুট
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data' নিজে থেকেই সেট হবে
          'Authorization': `Bearer ${adminToken}`, // <-- ৫. এখানে আসল টোকেন পাঠানো হচ্ছে
        },
        body: formData, // JSON নয়, FormData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add product');
      }

      alert("New Product Added Successfully!");
      router.push('/admin/products'); // অ্যাড শেষে প্রোডাক্ট লিস্টে ফেরত যান
      router.refresh(); // (ঐচ্ছিক) রাউট রিফ্রেশ করা

    } catch (error: any) {
      console.error("Failed to add product:", error);
      setError(error.message || 'Could not add product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (handleChange, handleSelectChange, handleImageChange অপরিবর্তিত)
  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // Select change handler
  const handleSelectChange = (name: keyof NewProductState) => (value: string) => {
     setProductData(prev => ({ ...prev, [name]: value as NewProductState['status'] | NewProductState['category'] }));
  }

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // ফাইলটি state-এ সেভ করা
      setImagePreview(URL.createObjectURL(file)); // প্রিভিউ দেখানো
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // <-- ৬. (ঐচ্ছিক) লোডিং এবং অথেনটিকেশন স্ট্যাটাস হ্যান্ডেল করা
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading session...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
     router.push('/auth/login'); // লগইন করা না থাকলে লগইন পেজে পাঠান
     return (
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Please log in to add a product.</p>
        </div>
     );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900"> Add New Product </h2>
          <p className="text-gray-600 text-sm"> Fill in the details for the new product. </p>
        </div>
        <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
      </div>

      {/* Add Form */}
      <form onSubmit={handleSubmit}>
        
        {/* এরর মেসেজ দেখানোর জায়গা */}
        {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-md mb-4">
              <p className="font-semibold">Error!</p>
              <p>{error}</p>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Column 1: Details, Pricing */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader> <CardTitle>Product Details</CardTitle> </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" onChange={handleChange} required placeholder="e.g., খাঁটি সরিষার তেল" disabled={isSubmitting} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" onChange={handleChange} rows={5} placeholder="Write something..." disabled={isSubmitting} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader> <CardTitle>Pricing & Inventory</CardTitle> </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (৳) <span className="text-red-500">*</span></Label>
                  <Input id="price" name="price" type="number" onChange={handleChange} required placeholder="550" min="0" step="0.01" disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="oldPrice">Old Price (৳)</Label>
                  <Input id="oldPrice" name="oldPrice" type="number" onChange={handleChange} placeholder="650" min="0" step="0.01" disabled={isSubmitting}/>
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
                  <Input id="stock" name="stock" type="number" onChange={handleChange} required placeholder="100" min="0" step="1" disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="discount">Discount Text</Label>
                  <Input id="discount" name="discount" onChange={handleChange} placeholder="15% Off" disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input id="weight" name="weight" onChange={handleChange} placeholder="500gm / 1kg / 1 Litre" disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="ingredients">Ingredients (Comma separated)</Label>
                  <Input id="ingredients" name="ingredients" onChange={handleChange} placeholder="সরিষা, মশলা..." disabled={isSubmitting}/>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Status, Category, Image */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader> <CardTitle>Organization</CardTitle> </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  {/* Select কম্পোনেন্টে onValueChange এবং name উভয়ই লাগবে */}
                  <Select onValueChange={handleSelectChange('category')} required disabled={isSubmitting} name="category">
                    <SelectTrigger id="category"> <SelectValue placeholder="Select category" /> </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Achar">Achar</SelectItem>
                      <SelectItem value="Pitha">Pitha</SelectItem>
                      <SelectItem value="Oil">Oil</SelectItem>
                      <SelectItem value="Nuts & Dates">Nuts & Dates</SelectItem>
                      <SelectItem value="Organic Spices">Organic Spices</SelectItem>
                      <SelectItem value="Rice, Pulse">Rice, Pulse</SelectItem>
                      <SelectItem value="Super Foods">Super Foods</SelectItem>
                      <SelectItem value="Sweeteners & Dairy">Sweeteners & Dairy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="Active" onValueChange={handleSelectChange('status')} disabled={isSubmitting} name="status">
                    <SelectTrigger id="status"> <SelectValue placeholder="Select status" /> </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
                <CardDescription>Upload the main image <span className="text-red-500">*</span></CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-center text-gray-500 p-4">
                      <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Image Preview Here</p>
                    </div>
                  )}
                </div>
                {/* Input-এ "name" অ্যাট্রিবিউটটি খুবই গুরুত্বপূর্ণ */}
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isSubmitting} required />
                <Label
                  htmlFor="image"
                  className={cn(
                    "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                    "h-10 px-4 py-2 w-full",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Upload size={16} className="mr-2" /> <span>Upload Image</span> <span className="text-red-500 ml-1">*</span>
                </Label>
                 {imageFile && <p className="text-xs text-muted-foreground text-center">Selected: {imageFile.name}</p>}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700 min-w-[150px]" disabled={isSubmitting || status !== 'authenticated'}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}