'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// প্রপস রিসিভ করার টাইপ
interface CustomerListProps {
  initialCustomers: any[]; // সার্ভার থেকে আসা ডাটা
}

export default function CustomerListClient({ initialCustomers }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // ক্লায়েন্ট সাইড ফিল্টারিং (দ্রুত রেসপন্সের জন্য)
  const filteredCustomers = initialCustomers.filter((customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Manage Customers</h2>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search name or email..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
      <Card>
           <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>Total Customers: {filteredCustomers.length}</CardDescription>
          </CardHeader>
           <CardContent>
             <div className="border rounded-lg overflow-hidden">
                <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="text-center">Orders</TableHead>
                        <TableHead className="text-right">Total Spent</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCustomers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No customers found.
                            </TableCell>
                        </TableRow>
                    )}
                    {filteredCustomers.map((customer) => (
                    <TableRow key={customer._id}>
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border">
                                {/* ইমেজ না থাকলে নামের প্রথম অক্ষর */}
                                <AvatarImage src={customer.avatar} />
                                <AvatarFallback className="bg-green-100 text-green-700">
                                    {customer.name?.slice(0,2).toUpperCase() || 'CN'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="font-medium text-sm">{customer.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{customer.email}</p>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{customer.email}</TableCell>
                        <TableCell className="text-center text-sm font-medium">{customer.totalOrders}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-green-600">৳ {customer.totalSpent}</TableCell>
                        <TableCell className="text-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/customers/${customer._id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                    </Link>
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
             </div>
           </CardContent>
      </Card>
    </div>
  );
}