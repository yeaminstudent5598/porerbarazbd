// app/(admin)/admin/products/edit/[id]/page.tsx
'use client'; // Required for hooks and event handlers

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation'; // Next.js hooks
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
import { cn } from '@/app/lib/utils';

// --- Type Definitions (Ensure consistency) ---
type ProductStatus = 'Active' | 'Draft' | 'Archived' | 'Out of Stock';
interface Product {
    id: number | string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    status: ProductStatus;
    imageUrl: string;
    oldPrice?: number;
    discount?: string;
    weight?: string;
    ingredients?: string; // Comma-separated
}
// Form state can use strings for inputs
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
// --- End Type Definitions ---

// === Demo Data (Must match data from ManageProductsPage) ===
// TODO: Replace with actual API call
const demoProducts: Product[] = [
  { id: 1, name: "কালোজিরা আচার", price: 890, stock: 50, status: "Active", category: "Achar", imageUrl: "https://efoodis.com/public/uploads/product/1756417513-%E0%A6%95%E0%A6%BE%E0%A6%B2%E0%A7%8B%E0%A6%9C%E0%A6%BF%E0%A6%B0%E0%A6%BE-%E0%A6%AE%E0%A6%BF%E0%A6%95%E0%A7%8D%E0%A6%B8-%E0%A6%86%E0%A6%9A%E0%A6%BE%E0%A6%B0.jpg", description: "সম্পূর্ণ ঘরোয়া পরিবেশে তৈরি...", oldPrice: 1250, discount: "29%", weight: "500gm", ingredients: "কালোজিরা, রসুন, সরিষার তেল" },
  { id: 5, name: "ঝিনুক পিঠা", price: 590, stock: 0, status: "Out of Stock", category: "Pitha", imageUrl: "https://efoodis.com/public/uploads/product/1756499233-jhinuk-pitha.jpg", description: "চিনির সিরায় ডোবানো...", oldPrice: 850, discount: "31%", weight: "1kg", ingredients: "ময়দা, চিনি, তেল" },
  { id: 7, name: "১.৫ লিটার কম্বো", price: 1250, stock: 20, status: "Active", category: "Oil", imageUrl: "https://efoodis.com/public/uploads/product/1758059095-combo-web-efoodis.jpg", description: "স্পেশাল কম্বো অফার...", oldPrice: 1800, discount: "31%", weight: "1.5L", ingredients: "সরিষা, কালিজিরা" },
  { id: 2, name: "ঝুড়ি পিঠা", price: 790, stock: 30, status: "Draft", category: "Pitha", imageUrl: "https://efoodis.com/public/uploads/product/1754690259-juri.webp", description: "মুচমুচে ঝুড়ি পিঠা...", oldPrice: 850, discount: "7%", weight: "1kg", ingredients: "চালের গুঁড়া" },
];

// Mock fetch function
const fetchProductById = async (id: string): Promise<Product | null> => {
    console.log(`Fetching product with ID: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    const numericId = Number(id);
    const product = demoProducts.find(p => p.id === numericId);
    return product || null;
};
// =============================================================

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string; // Get product ID from URL

  const [productData, setProductData] = useState<ProductFormState | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) {
        setIsLoading(false);
        notFound(); // If no ID, show 404
        return;
    }

    setIsLoading(true);
    fetchProductById(id)
      .then(data => {
        if (!data) {
          notFound(); // If product not found, show 404
        } else {
          // Populate form state from fetched data
          setProductData({
            name: data.name,
            description: data.description,
            price: String(data.price), // Convert number to string for input
            stock: String(data.stock),
            category: data.category,
            status: data.status,
            oldPrice: String(data.oldPrice || ''), // Handle optional
            discount: data.discount || '',
            weight: data.weight || '',
            ingredients: data.ingredients || '',
          });
          setImagePreview(data.imageUrl); // Set initial image preview
        }
      })
      .catch(error => {
        console.error("Failed to fetch product:", error);
        // Show error state (optional)
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]); // Re-fetch if ID changes

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productData) return;
    setIsUpdating(true);

    // TODO: Implement actual API call here
    // 1. If imageFile exists, upload it first and get the new URL
    // 2. Send productData (with new imageUrl if changed) to your API endpoint
    //    e.g., await fetch(`/api/products/${id}`, { method: 'PUT', ... })

    try {
      console.log("Updating product:", id, productData);
      console.log("New image (if any):", imageFile?.name);
      
      // --- Simulate API call ---
      await new Promise(resolve => setTimeout(resolve, 1500));
      // --- End Simulation ---

      alert("Product Updated Successfully!");
      router.push('/admin/products'); // Navigate back to product list

    } catch (error: any) {
      console.error("Failed to update product:", error);
      alert(`Error: ${error.message || 'Could not update product.'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Select change handler
  const handleSelectChange = (name: keyof ProductFormState) => (value: string) => {
     setProductData(prev => prev ? { ...prev, [name]: value as ProductStatus } : null); // Cast value
  }

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Store the new file
      // Create a local URL for instant preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading product data...
      </div>
    );
  }

  if (!productData) {
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
  // If we reach here, 'productData' is available

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Edit Product
          </h2>
          <p className="text-gray-600 text-sm">
            Updating: <span className="font-medium text-black">{productData.name}</span> (ID: {id})
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()} disabled={isUpdating}>
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Column 1: Details, Pricing (Sticky) */}
          <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24">
            <Card>
              <CardHeader> <CardTitle>Product Details</CardTitle> </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" value={productData.name} onChange={handleChange} required disabled={isUpdating} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={productData.description} onChange={handleChange} rows={5} disabled={isUpdating} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader> <CardTitle>Pricing & Inventory</CardTitle> </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (৳) <span className="text-red-500">*</span></Label>
                  <Input id="price" name="price" type="number" value={productData.price} onChange={handleChange} required min="0" step="0.01" disabled={isUpdating}/>
                </div>
                 <div>
                  <Label htmlFor="oldPrice">Old Price (৳)</Label>
                  <Input id="oldPrice" name="oldPrice" type="number" value={productData.oldPrice || ''} onChange={handleChange} min="0" step="0.01" disabled={isUpdating}/>
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
                  <Input id="stock" name="stock" type="number" value={productData.stock} onChange={handleChange} required min="0" step="1" disabled={isUpdating}/>
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
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Input id="ingredients" name="ingredients" value={productData.ingredients || ''} onChange={handleChange} placeholder="Comma separated..." disabled={isUpdating}/>
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
                {/* Image Preview */}
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
                {/* Upload Trigger */}
                <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isUpdating} />
                <Label
                  htmlFor="picture"
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