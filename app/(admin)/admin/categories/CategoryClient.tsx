'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
// ✅ FIX: Next Image ইম্পোর্ট করা হয়েছে
import Image from 'next/image'; 
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// ✅ FIX: lucide-react থেকে Image ইম্পোর্ট করবেন না, ImageIcon ব্যবহার করুন
import { PlusCircle, Edit, Trash2, Loader2, AlertTriangle, ImageIcon, UploadCloud, X } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  imagePublicId?: string;
}

interface CategoryClientProps {
  initialCategories: Category[];
}

export default function CategoryClient({ initialCategories }: CategoryClientProps) {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryFile, setNewCategoryFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const resetForm = () => {
    setNewCategoryName("");
    setNewCategoryFile(null);
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    setSubmitError(null);
    setEditingCategory(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) resetForm();
    setIsDialogOpen(open);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setPreviewImage(category.imageUrl || null);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCategoryFile(file);
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setNewCategoryFile(null);
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = (session as any)?.accessToken;

    if (!token) {
      setSubmitError('Authentication failed. Please log in again.');
      return;
    }

    if (!editingCategory && !newCategoryFile) {
      setSubmitError('Category image is required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append('name', newCategoryName);
    if (newCategoryFile) {
      formData.append('image', newCategoryFile);
    }

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory._id}` 
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Operation failed.');

      if (editingCategory) {
        setCategories(prev => prev.map(cat => cat._id === editingCategory._id ? data.data : cat));
        alert("Category updated successfully!");
      } else {
        setCategories(prev => [...prev, data.data]);
        alert("Category created successfully!");
      }

      handleDialogOpenChange(false);

    } catch (error: any) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteCategory = async (id: string) => {
      if(!confirm("Are you sure you want to delete this category?")) return;

      const token = (session as any)?.accessToken;
      if (!token) {
        alert('Authentication failed.');
        return;
      }

      try {
        const res = await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Delete failed');

        setCategories(prev => prev.filter(cat => cat._id !== id));
        alert("Category deleted successfully!");

      } catch (error: any) {
          alert(error.message);
      }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Manage Categories</h2>
        <Button onClick={() => handleDialogOpenChange(true)} className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
          <CardDescription>View and manage all product categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <Avatar className="h-10 w-10 rounded-md border">
                        <AvatarImage src={category.imageUrl} alt={category.name} className="object-cover" />
                        <AvatarFallback className="rounded-md bg-gray-100">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-sm text-gray-500">{category.slug || "No Slug"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(category)}>
                            <Edit className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDeleteCategory(category._id)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No categories found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
                {editingCategory ? 'Update the category details.' : 'Fill in the details and upload an image.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input 
                    id="name" 
                    value={newCategoryName} 
                    onChange={(e) => setNewCategoryName(e.target.value)} 
                    required 
                />
              </div>
              <div className="space-y-2">
                 <Label>Category Image</Label>
                 {previewImage ? (
                  <div className="relative w-full h-40 border rounded-md overflow-hidden">
                    {/* ✅ FIX: Next.js Image Component */}
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill={true}
                      style={{ objectFit: 'cover' }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 rounded-full"
                      onClick={removeSelectedImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Label 
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                    </div>
                    <Input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </Label>
                )}
              </div>
            </div>

            {submitError && <Alert variant="destructive" className="mb-4"><AlertDescription>{submitError}</AlertDescription></Alert>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" className="bg-green-600" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : (editingCategory ? "Update Category" : "Create Category")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}