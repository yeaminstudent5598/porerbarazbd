'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Phone, Loader2, AlertTriangle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/fetcher';

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.customerId as string;
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const { data: apiResponse, isLoading, error } = useSWR(
    token && customerId ? `/api/v1/customers/${customerId}` : null,
    (url) => fetcher(url, token)
  );

  const customer = apiResponse?.data;

  if (isLoading) return <div className="flex justify-center h-screen items-center"><Loader2 className="animate-spin"/></div>;
  if (error || !customer) return <div className="p-10 text-center text-red-500">Customer not found</div>;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold">Customer Profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
             <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <Avatar className="h-16 w-16 border">
                    <AvatarFallback className="text-xl bg-green-100 text-green-700">
                        {customer.name.slice(0,2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                      <CardTitle className="text-xl">{customer.name}</CardTitle>
                      <CardDescription>Joined: {new Date(customer.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3 pt-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-gray-700 break-all">{customer.email}</span>
                </div>
                {/* Phone number from order if user profile doesn't have it */}
                {customer.orders?.[0]?.customerInfo?.phone && (
                    <div className="flex items-center gap-3">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-gray-700">{customer.orders[0].customerInfo.phone}</span>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Total Spent: <span className="font-bold text-green-700">৳ {customer.totalSpent}</span> ({customer.orders.length} Orders)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customer.orders.length === 0 ? (
                 <p className="text-center py-10 text-muted-foreground">No orders placed yet.</p>
              ) : (
                 <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customer.orders.map((order: any) => (
                                <TableRow key={order._id}>
                                    <TableCell className="font-medium text-blue-600">
                                        <Link href={`/admin/orders/${order._id}`}>#ORD-{order._id.slice(-6).toUpperCase()}</Link>
                                    </TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge variant="outline">{order.status}</Badge></TableCell>
                                    <TableCell className="text-right font-bold">৳ {order.totalAmount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}