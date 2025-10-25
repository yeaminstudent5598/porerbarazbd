// app/(admin)/admin/products/page.tsx
'use client'; // For state, AlertDialog, DropdownMenu

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// === Card কম্পোনেন্টগুলো ইম্পোর্ট করুন ===
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// ===================================
import { Input } from '@/components/ui/input'; // For potential search

// Define Product Type
interface Product {
    id: number | string;
    name: string;
    price: number;
    stock: number;
    status: 'Active' | 'Draft' | 'Archived' | 'Out of Stock';
    category?: string;
}

// TODO: Fetch this data
const demoProducts: Product[] = [
  { id: 1, name: "কালোজিরা আচার", price: 890, stock: 50, status: "Active", category: "Achar" },
  { id: 5, name: "ঝিনুক পিঠা", price: 590, stock: 0, status: "Out of Stock", category: "Pitha" },
  { id: 7, name: "১.৫ লিটার কম্বো", price: 1250, stock: 20, status: "Active", category: "Oil" },
  { id: 2, name: "ঝুড়ি পিঠা", price: 790, stock: 30, status: "Draft", category: "Pitha" },
];

// Status Badge Logic
const getStatusBadge = (status: Product['status']) => {
  switch (status) {
    case 'Active': return <Badge className="bg-green-100 text-green-700 border-green-200">{status}</Badge>;
    case 'Draft': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">{status}</Badge>;
    case 'Out of Stock': return <Badge variant="destructive">{status}</Badge>;
    case 'Archived': return <Badge variant="secondary">{status}</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ManageProductsPage() {
  // TODO: Implement actual data fetching and state management
  const [products, setProducts] = useState<Product[]>(demoProducts);

  const handleDelete = (productId: number | string) => {
    console.log("Attempting to delete product:", productId);
    // TODO: Call API to delete product
    alert(`Product ${productId} delete action triggered!`);
    // Example: Update state after successful deletion
    // setProducts(prev => prev.filter(p => p.id !== productId));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Manage Products</h2>
        <Button asChild className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Link href="/admin/products/add">
            <Plus size={20} className="mr-2" /> Add New Product
          </Link>
        </Button>
      </div>

      {/* Product Table inside a Card */}
      <Card>
        <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>View, edit, or delete products.</CardDescription>
             {/* TODO: Add search/filter inputs here */}
             <div className="pt-2">
                 <Input placeholder="Search products..." className="max-w-sm"/>
             </div>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg overflow-x-auto"> {/* Added overflow-x-auto for small screens */}
                <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 w-[40%] min-w-[200px]">Product Name</TableHead> {/* Min width */}
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">Stock</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Price</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No products found. <Link href="/admin/products/add" className="text-green-600 hover:underline">Add one now!</Link>
                            </TableCell>
                        </TableRow>
                    )}
                    {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{product.stock <= 0 ? <span className="text-red-500">0</span> : product.stock} units</TableCell>
                        <TableCell className="text-right">৳ {product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                           <AlertDialog>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Product actions</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/products/edit/${product.id}`}>
                                        <Edit className="mr-2 h-4 w-4"/> Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                                        <Trash2 className="mr-2 h-4 w-4"/> Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                </DropdownMenuContent>
                             </DropdownMenu>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product "{product.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                  >
                                    Yes, delete product
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
             {/* TODO: Add Pagination controls */}
             <div className="flex items-center justify-end space-x-2 py-4">
                 <Button variant="outline" size="sm" /* disabled */ > Previous </Button>
                 <Button variant="outline" size="sm" /* disabled */ > Next </Button>
             </div>
        </CardContent>
       </Card>
    </div>
  );
}