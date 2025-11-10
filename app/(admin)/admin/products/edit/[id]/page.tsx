// app/(admin)/admin/products/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
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
import { ArrowLeft, Save, Upload, Image as ImageIcon, Loader2, AlertTriangle } from 'lucide-react';
import useSWR from 'swr'; // <-- SWR ইম্পোর্ট
import { IProduct } from '@/modules/product/product.interface'; // <-- Product ইন্টারফেস
import { useAuth } from '@/app/lib/context/AuthContext';
import { fetcher } from '@/app/lib/fetcher';
import { cn } from '@/app/lib/utils';

// API রেসপন্সের টাইপ
interface ApiProductResponse {
  success: boolean;
  message: string;
  data: IProduct;
}

type ProductStatus = 'Active' | 'Draft' | 'Archived' | 'Out of Stock';

// Form state interface
interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  status: ProductStatus;
  oldPrice?: string;
  discount?: string;
  weight?: string;
  ingredients?: string;
}

// --- ডেমো ডেটা এবং fetchProductById ফাংশন ডিলিট করা হয়েছে ---

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string; // URL থেকে প্রডাক্ট ID
  const { token, isLoading: isAuthLoading } = useAuth(); // Auth Context

  // === SWR দিয়ে আসল ডেটা ফেচিং ===
  // অ্যাডমিন রুট ব্যবহার করা হয়েছে, যা Draft প্রোডাক্টও আনতে পারে
  const apiUrl = token && id ? [`/api/admin/products/${id}`, token] : null;
  
  const { 
    data: apiResponse, 
    error: swrError, 
    isLoading: isSWRLoading, 
    mutate // SWR ক্যাশে রিফ্রেশ করার জন্য
  } = useSWR<ApiProductResponse>(apiUrl, fetcher);
  
  const product = apiResponse?.data; // ফেচ করা প্রোডাক্ট
  // ==================================

  // Partial ব্যবহার করা হয়েছে কারণ state শুরুতে খালি থাকতে পারে
  const [productData, setProductData] = useState<Partial<ProductFormState>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null); // ফর্ম এরর স্টেট

  // SWR দিয়ে ডেটা লোড হলে ফর্ম স্টেট সেট করুন
  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        category: product.category,
        status: product.status,
        oldPrice: String(product.oldPrice || ''),
        discount: product.discount || '',
        weight: product.weight || '',
        ingredients: product.ingredients?.join(', ') || '', // অ্যারে-কে স্ট্রিং-এ রূপান্তর
      });
      setImagePreview(product.imageUrl);
    }
  }, [product]); // product ডেটা পরিবর্তন হলে এই ইফেক্ট রান হবে

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productData || !token) {
        setFormError("Authorization failed or form data missing.");
        return;
    }
    setIsUpdating(true);
    setFormError(null);

    // ১. FormData তৈরি করা
    const formData = new FormData(e.currentTarget);
    // imageFile state-এ থাকলেই শুধু নতুন ছবি যোগ করুন
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    // `productData` state থেকে সব ভ্যালু FormData-তে সেট করুন
    Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined) {
             formData.set(key, value as string);
        }
    });

    try {
      // ২. API কল (PUT /api/products/[id])
      const response = await fetch(`/api/products/${id}`, { // <-- PUT রুট কল
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // TODO: আপনার PUT রুটকে FormData হ্যান্ডেল করতে হবে
      });

      const result = await response.json();
      if (!response.ok) { throw new Error(result.message || 'Failed to update product'); }

      alert("Product Updated Successfully!");
      mutate(); // SWR ক্যাশে রিফ্রেশ করুন
      router.push('/admin/products');
      router.refresh();

    } catch (error: any) {
      console.error("Failed to update product:", error);
      setFormError(error.message || 'Could not update product.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value })); // null চেক বাদ
  };

  // Select change handler
  const handleSelectChange = (name: keyof ProductFormState) => (value: string) => {
     setProductData(prev => ({ ...prev, [name]: value as ProductFormState['status'] | ProductFormState['category'] })); // null চেক বাদ
  }

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- Render Logic ---
  const isLoading = isAuthLoading || isSWRLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading product data...
      </div>
    );
  }

  // SWR বা Auth এরর
  if (swrError) {
     return (
        <div className="p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-2xl font-semibold text-destructive">Error Loading Product</h2>
            <p className="mt-2 text-red-600 mb-4">{swrError.message}</p>
            <Button variant="outline" onClick={() => router.push('/admin/products')}>
                <ArrowLeft size={16} className="mr-2" /> Back to Products
            </Button>
        </div>
     );
  }
  
  // প্রোডাক্ট লোড হয়েছে কিন্তু ডেটা নেই (404 from API)
  // অথবা ফর্ম স্টেট এখনও পপুলেট হয়নি
  if (!product || !productData.name) {
       return (
        <div className="p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-2xl font-semibold text-destructive">Product Not Found</h2>
            <p className="mt-2 text-red-600 mb-4">Failed to load product details for ID: {id}.</p>
            <Button variant="outline" onClick={() => router.push('/admin/products')}>
                <ArrowLeft size={16} className="mr-2" /> Back to Products
            </Button>
        </div>
     );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Edit Product
          </h2>
          <p className="text-gray-600 text-sm">
            Updating: <span className="font-medium text-black">{productData.name}</span>
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()} disabled={isUpdating}>
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit}>
         {formError && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-md mb-4 text-sm">
                <p className="font-semibold">Error:</p>
                <p>{formError}</p>
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1: Details, Pricing (Sticky) */}
          <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24">
            <Card>
              <CardHeader> <CardTitle>Product Details</CardTitle> </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" value={productData.name || ''} onChange={handleChange} required disabled={isUpdating} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={productData.description || ''} onChange={handleChange} rows={5} disabled={isUpdating} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader> <CardTitle>Pricing & Inventory</CardTitle> </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (৳) <span className="text-red-500">*</span></Label>
                  <Input id="price" name="price" type="number" value={productData.price || ''} onChange={handleChange} required min="0" step="0.01" disabled={isUpdating}/>
                </div>
                 <div>
                  <Label htmlFor="oldPrice">Old Price (৳)</Label>
                  <Input id="oldPrice" name="oldPrice" type="number" value={productData.oldPrice || ''} onChange={handleChange} min="0" step="0.01" disabled={isUpdating}/>
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
                  <Input id="stock" name="stock" type="number" value={productData.stock || ''} onChange={handleChange} required min="0" step="1" disabled={isUpdating}/>
                </div>
                 <div>
                  <Label htmlFor="discount">Discount Text</Label>
                  <Input id="discount" name="discount" value={productData.discount || ''} onChange={handleChange} placeholder="e.g., 15% Off" disabled={isUpdating}/>
                 </div>
                 <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input id="weight" name="weight" value={productData.weight || ''} onChange={handleChange} placeholder="e.g., 500gm, 1kg" disabled={isUpdating}/>
                </div>
                 <div>
                  <Label htmlFor="ingredients">Ingredients (Comma separated)</Label>
                  <Input id="ingredients" name="ingredients" value={productData.ingredients || ''} onChange={handleChange} placeholder="সরিষা, মশলা..." disabled={isUpdating}/>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Column 2: Status, Category, Image (Sticky) */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <Card>
              <CardHeader> <CardTitle>Organization</CardTitle> </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select value={productData.category} onValueChange={handleSelectChange('category')} required disabled={isUpdating} name="category">
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
                  <Select value={productData.status} onValueChange={handleSelectChange('status')} disabled={isUpdating} name="status">
                    <SelectTrigger id="status"> <SelectValue placeholder="Select status" /> </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                       <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
                <CardDescription>Upload to change image.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-center text-gray-500 p-4">
                      <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No Image Available</p>
                    </div>
                  )}
                </div>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isUpdating} />
                <Label
                  htmlFor="image"
                  className={cn(
                    "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                    "h-10 px-4 py-2 w-full",
                    isUpdating && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Upload size={16} className="mr-2" /> Change Image
                </Label>
                 {imageFile && <p className="text-xs text-muted-foreground text-center">New: {imageFile.name}</p>}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button (Sticky Footer) */}
        <div className="mt-8 flex justify-end sticky bottom-6">
          <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700 min-w-[170px] shadow-lg" disabled={isUpdating}>
            {isUpdating ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <Save size={18} className="mr-2" />
            )}
            {isUpdating ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}