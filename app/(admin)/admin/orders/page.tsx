'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Truck, XCircle, FileDown, Loader2, AlertTriangle, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useSWR, { mutate } from 'swr';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import Image from 'next/image'; // ✅ ইমেজ ইম্পোর্ট করা হলো

// Helper Functions
const formatOrderId = (id: string) => `#ORD-${id.slice(-6).toUpperCase()}`;

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Delivered': return <Badge className="bg-green-100 text-green-700 border-green-200">{status}</Badge>;
    case 'Processing': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{status}</Badge>;
    case 'Shipped': return <Badge className="bg-purple-100 text-purple-700 border-purple-200">{status}</Badge>;
    case 'Pending': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">{status}</Badge>;
    case 'Cancelled': return <Badge variant="destructive">{status}</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

// Fetcher function
const fetcher = async (url: string, token: string) => {
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch');
    }
    return res.json();
};

export default function ManageOrdersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken;

  // API URL Construction
  const apiUrl = token ? `/api/v1/orders?page=${page}&limit=10&searchTerm=${searchTerm}` : null;

  // Fetch Data
  const { data: apiResponse, error, isLoading } = useSWR(
    apiUrl, 
    (url) => fetcher(url, token), 
    { keepPreviousData: true }
  );

  const orders = apiResponse?.data || [];
  const meta = apiResponse?.meta;

  // Update Status Function
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!token) {
        toast.error("Unauthorized action");
        return;
    }
    
    try {
        const res = await fetch(`/api/v1/orders/${id}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if(!res.ok) throw new Error("Failed to update");
        
        toast.success(`Order marked as ${newStatus}`);
        mutate(apiUrl); 
    } catch (err) {
        toast.error("Something went wrong");
    }
  };

  if (status === 'loading') {
      return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin"/></div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Manage Orders</h2>
        <Button variant="outline"> <FileDown size={16} className="mr-2"/> Export </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Manage customer orders.</CardDescription>
          <div className="pt-4">
             <Input 
                placeholder="Search by Customer Name or Phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
             />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  {/* ✅ নতুন কলাম: Image */}
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            <Loader2 className="animate-spin mx-auto h-6 w-6 text-green-600"/>
                        </TableCell>
                    </TableRow>
                )}
                
                {error && (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-red-500 h-24">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <AlertTriangle className="h-6 w-6"/>
                                <p>{error.message === "Forbidden. You do not have permission." ? "Access Denied: Admin Only" : "Failed to load data"}</p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}

                {!isLoading && !error && orders.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center h-24 text-gray-500">
                            No orders found.
                        </TableCell>
                    </TableRow>
                )}
                
                {!isLoading && orders.map((order: any) => (
                  <TableRow key={order._id}>
                    {/* ✅ Image Cell: অর্ডারের প্রথম আইটেমের ছবি দেখাবে */}
                    <TableCell>
                        <div className="relative h-12 w-12 rounded-md overflow-hidden border bg-gray-50">
                          {order.items?.[0]?.image ? (
                            <Image
                              src={order.items[0].image}
                              alt="Order Item"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                    </TableCell>

                    <TableCell className="font-medium">{formatOrderId(order._id)}</TableCell>
                    
                    <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    
                    {/* ✅ Customer Cell: ফোন নাম্বার এখানে শো করা হচ্ছে */}
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{order.customerInfo?.name}</span>
                            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                📞 {order.customerInfo?.phone || "N/A"}
                            </span>
                        </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right font-semibold">৳ {order.totalAmount}</TableCell>
                    
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order._id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'Processing')}>Mark Processing</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'Delivered')}>Mark Delivered</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'Cancelled')} className="text-red-600">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p+1)} disabled={!meta || meta.total <= page * meta.limit}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}