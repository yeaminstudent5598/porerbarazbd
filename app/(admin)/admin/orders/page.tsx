// app/(admin)/admin/orders/page.tsx
'use client'; // Required for useState, client components like DropdownMenu

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // shadcn/ui Table
import { Badge } from '@/components/ui/badge'; // shadcn/ui Badge
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Truck, XCircle, Filter, FileDown } from 'lucide-react'; // Added Filter, FileDown
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import Card components
import { Input } from '@/components/ui/input'; // For Search/Filter

// Define Order type (adjust as needed)
interface Order {
    id: string; // User-friendly order number like #EFOODS-1052
    orderDbId: string; // Actual DB ID (e.g., MongoDB ObjectId as string)
    date: string; // Or Date object
    customer: string;
    total: number;
    status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
}

// TODO: Fetch this data from your API (ideally using Server Component props or useEffect)
const demoOrders: Order[] = [
  {
    id: "#EFOODS-1052",
    orderDbId: "67890def1234567890abcdef",
    date: "October 20, 2025",
    customer: "সাদিয়া ইসলাম",
    total: 1480.00,
    status: "Delivered",
  },
  {
    id: "#EFOODS-1051",
    orderDbId: "abcdef1234567890abcdef12",
    date: "October 20, 2025",
    customer: "আরিফুর রহমান",
    total: 890.00,
    status: "Processing",
  },
  {
    id: "#EFOODS-1050",
    orderDbId: "1234567890abcdef12345678",
    date: "October 19, 2025",
    customer: "নাসরিন সুলতানা",
    total: 590.00,
    status: "Pending",
  },
  {
    id: "#EFOODS-1049",
    orderDbId: "fedcba9876543210fedcba98",
    date: "October 18, 2025",
    customer: "কামাল আহমেদ",
    total: 1250.00,
    status: "Cancelled",
  },
];

// Status Badge Component/Function
const getStatusBadge = (status: Order['status']) => {
  switch (status) {
    case 'Delivered':
      return <Badge className="bg-green-100 text-green-700 border-green-200">{status}</Badge>;
    case 'Processing':
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{status}</Badge>;
    case 'Pending':
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">{status}</Badge>;
    case 'Cancelled':
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function ManageOrdersPage() {
  // TODO: Implement actual data fetching, filtering, pagination, and state management
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [searchTerm, setSearchTerm] = useState(''); // For filtering

  // Example update status function (replace with API call)
  const handleUpdateStatus = (orderDbId: string, newStatus: Order['status']) => {
    console.log(`Updating order ${orderDbId} to ${newStatus}`);
    setOrders(orders.map(order =>
      order.orderDbId === orderDbId ? { ...order, status: newStatus } : order
    ));
    // TODO: Add API call to update status in the database
  };

  // Filter orders based on search term (simple example)
  const filteredOrders = orders.filter(order =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Title, Filter, Export */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Manage Orders</h2>
        <div className="flex gap-2 w-full sm:w-auto">
           {/* TODO: Add filtering dropdown/modal */}
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter size={16} className="mr-2"/> Filter
          </Button>
          {/* TODO: Implement export functionality */}
          <Button variant="outline" className="w-full sm:w-auto">
            <FileDown size={16} className="mr-2"/> Export
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
           <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>View, manage, and update customer orders.</CardDescription>
               {/* Search Input */}
              <div className="pt-4">
                 <Input
                    type="search"
                    placeholder="Search by Order ID or Customer..."
                    className="w-full md:max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
          </CardHeader>
           <CardContent>
             <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 w-[140px]">Order ID</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Date</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Total</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center w-[100px]">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredOrders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No orders found{searchTerm ? ' matching your search' : ''}.
                            </TableCell>
                        </TableRow>
                    )}
                    {filteredOrders.map((order) => (
                        <TableRow key={order.orderDbId}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                        <TableCell className="text-sm">{order.customer}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right text-sm">৳ {order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                            {/* Actions Dropdown */}
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Order actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                {/* Link using the URL-safe encoded ID */}
                                <Link href={`/admin/orders/${encodeURIComponent(order.id)}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.orderDbId, 'Processing')} disabled={order.status === 'Processing' || order.status === 'Delivered' || order.status === 'Cancelled'}>
                                <Truck className="mr-2 h-4 w-4 text-blue-500" /> Mark as Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.orderDbId, 'Delivered')} disabled={order.status === 'Delivered' || order.status === 'Cancelled'}>
                                <Truck className="mr-2 h-4 w-4 text-green-500" /> Mark as Delivered
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.orderDbId, 'Cancelled')} disabled={order.status === 'Delivered' || order.status === 'Cancelled'} className="text-red-500 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                                <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
              </div>
              {/* TODO: Add Pagination controls */}
               <div className="flex items-center justify-end space-x-2 py-4">
                 <Button variant="outline" size="sm" /* onClick={goToPrevPage} disabled={!hasPrevPage} */ > Previous </Button>
                 <Button variant="outline" size="sm" /* onClick={goToNextPage} disabled={!hasNextPage} */ > Next </Button>
             </div>
           </CardContent>
      </Card>
    </div>
  );
}