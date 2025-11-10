'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useSWR from 'swr';
import { IProduct } from '@/modules/product/product.interface';
import { fetcher } from '@/app/lib/fetcher';

// Response type
interface ApiResponse {
  success: boolean;
  message: string;
  data: IProduct[];
  meta: { total: number; page: number; limit: number };
}

//  Status badge helper
const getStatusBadge = (status: IProduct['status']) => {
  switch (status) {
    case 'Active':
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          {status}
        </Badge>
      );
    case 'Draft':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          {status}
        </Badge>
      );
    case 'Out of Stock':
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ManageProductsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  // ✅ Load token and set full API URL client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) setToken(storedToken);

      // Build full URL so it works in nested routes
      const base = window.location.origin;
      setApiUrl(`${base}/api/products?page=${page}&limit=10&searchTerm=${searchTerm}`);
    }
  }, [page, searchTerm]);

  // ✅ SWR for fetching data safely
  const { data: apiResponse, error, isLoading, mutate: revalidateProducts } = useSWR<ApiResponse>(
    apiUrl,
    (url) => (url ? fetcher(url, token ?? undefined) : null),
    { revalidateOnFocus: false }
  );

  const products = apiResponse?.data || [];
  const meta = apiResponse?.meta;

  // ✅ Delete handler
  const handleDelete = async (productId: string) => {
    if (!token) {
      alert('Error: No authorization token found.');
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete product');

      alert('✅ Product deleted successfully.');
      revalidateProducts();
    } catch (err: any) {
      console.error('Delete Error:', err);
      alert(`❌ ${err.message}`);
    }
  };

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

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>View, edit, or delete products.</CardDescription>
          <div className="pt-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name..."
                className="pl-8"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="w-[40%]">Product Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Loading */}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                )}

                {/* Error */}
                {error && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-red-600">
                      <AlertTriangle className="mx-auto h-6 w-6 mb-2" />
                      Failed to load products.
                      <br />
                      <span className="text-xs text-muted-foreground">{error.message}</span>
                    </TableCell>
                  </TableRow>
                )}

                {/* Empty */}
                {!isLoading && !error && products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No products found.{' '}
                      <Link href="/admin/products/add" className="text-green-600 hover:underline">
                        Add one now!
                      </Link>
                    </TableCell>
                  </TableRow>
                )}

                {/* Products */}
                {!isLoading &&
                  !error &&
                  products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {product.stock <= 0 ? (
                          <span className="text-red-500">0</span>
                        ) : (
                          `${product.stock} units`
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        ৳ {product.price ? product.price.toFixed(2) : '0.00'}
                      </TableCell>
                      <TableCell className="text-center">
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/products/edit/${product._id}`}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{product.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product._id as string)}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                Yes, delete
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

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={isLoading || page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {meta?.page || 1} of {meta ? Math.ceil(meta.total / meta.limit) : 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading || !meta || meta.page * meta.limit >= meta.total}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
