// app/(admin)/admin/products/add/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, Save, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'; // Added Loader2
import { cn } from '@/app/lib/utils';

// Product state interface
interface NewProductState {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived';
  imageUrl?: string;
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
  const [productData, setProductData] = useState<NewProductState>(initialProductState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the image file

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) {
        alert("Please upload a product image.");
        return;
    }
    setIsSubmitting(true);
    console.log("Submitting new product:", productData);
    console.log("Image file:", imageFile);

    // TODO: Implement actual API call here
    // 1. Upload image to storage (e.g., Cloudinary, S3, or a simple backend route)
    // 2. Get the uploaded image URL
    // 3. Send productData (with imageUrl) to your '/api/products' endpoint

    try {
      // --- Simulate API call ---
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Assume success and get a dummy URL
      const uploadedImageUrl = imagePreview; // Replace with actual URL from upload
      const finalProductData = {
          ...productData,
          imageUrl: uploadedImageUrl,
          price: Number(productData.price) || 0,
          stock: Number(productData.stock) || 0,
          oldPrice: Number(productData.oldPrice) || undefined,
      };
      console.log("Final data to send:", finalProductData);
      // --- End Simulation ---

      // Example API call structure:
      // const response = await fetch('/api/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' /* Add Auth header */ },
      //   body: JSON.stringify(finalProductData),
      // });
      // if (!response.ok) { /* handle error */ }

      alert("New Product Added Successfully!");
      router.push('/admin/products');

    } catch (error: any) {
      console.error("Failed to add product:", error);
      alert(`Error: ${error.message || 'Could not add product.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // Select change handler
  const handleSelectChange = (name: keyof NewProductState) => (value: string) => {
     setProductData(prev => ({ ...prev, [name]: value as NewProductState['status'] | NewProductState['category'] })); // Type assertion
  }

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Store the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setImageFile(null);
        setImagePreview(null);
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Column 1: Details, Pricing */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader> <CardTitle>Product Details</CardTitle> </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" value={productData.name} onChange={handleChange} required placeholder="e.g., খাঁটি সরিষার তেল" disabled={isSubmitting} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={productData.description} onChange={handleChange} rows={5} placeholder="Write something..." disabled={isSubmitting} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader> <CardTitle>Pricing & Inventory</CardTitle> </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (৳) <span className="text-red-500">*</span></Label>
                  <Input id="price" name="price" type="number" value={productData.price} onChange={handleChange} required placeholder="550" min="0" step="0.01" disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="oldPrice">Old Price (৳)</Label>
                  <Input id="oldPrice" name="oldPrice" type="number" value={productData.oldPrice || ''} onChange={handleChange} placeholder="650" min="0" step="0.01" disabled={isSubmitting}/>
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
                  <Input id="stock" name="stock" type="number" value={productData.stock} onChange={handleChange} required placeholder="100" min="0" step="1" disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="discount">Discount Text</Label>
                  <Input id="discount" name="discount" value={productData.discount || ''} onChange={handleChange} placeholder="15% Off" disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input id="weight" name="weight" value={productData.weight || ''} onChange={handleChange} placeholder="500gm / 1kg / 1 Litre" disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Input id="ingredients" name="ingredients" value={productData.ingredients || ''} onChange={handleChange} placeholder="Comma separated..." disabled={isSubmitting}/>
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
                  <Select value={productData.category} onValueChange={handleSelectChange('category')} required disabled={isSubmitting} name="category">
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
                  <Select value={productData.status} onValueChange={handleSelectChange('status')} disabled={isSubmitting} name="status">
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
                <CardDescription>Upload the main image.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                {/* Image Preview */}
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
                {/* Upload Trigger */}
                <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isSubmitting} required />
                <Label
                  htmlFor="picture"
                  className={cn( // Style as button
                    "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Outline style
                    "h-10 px-4 py-2 w-full", // Size
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
          <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700 min-w-[150px]" disabled={isSubmitting}> {/* Added min-width */}
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