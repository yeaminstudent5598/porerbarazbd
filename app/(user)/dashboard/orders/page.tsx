// app/(user)/dashboard/orders/page.tsx
'use client'; // Required for useState and potentially Button onClick if used for details

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // shadcn/ui Table
import { Badge } from "@/components/ui/badge"; // shadcn/ui Badge
import { Button } from "@/components/ui/button";
import { Eye, Archive } from 'lucide-react'; // Icons
import Link from 'next/link'; // For View Details link

// Define Order type (adjust based on your actual data)
interface Order {
    id: string; // Typically MongoDB ObjectId as string
    orderNumber: string; // User-friendly order number like #EFOODS-1052
    date: string; // Or Date object
    status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled'; // Example statuses
    total: number;
}

// Demo Order Data (Replace with data fetching, e.g., from context or API call)
const demoOrders: Order[] = [
  {
    id: "67890def1234567890abcdef", // Example MongoDB ID
    orderNumber: "#EFOODS-1052",
    date: "October 20, 2025",
    status: "Delivered",
    total: 1480.00
  },
  {
    id: "abcdef1234567890abcdef12",
    orderNumber: "#EFOODS-1051",
    date: "October 20, 2025",
    status: "Processing",
    total: 890.00
  },
  {
    id: "1234567890abcdef12345678",
    orderNumber: "#EFOODS-1050",
    date: "October 19, 2025",
    status: "Pending",
    total: 590.00
  }
];

// Status Badge Component/Function (same as admin)
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

// --- Main OrderHistoryPage Component ---
export default function OrderHistoryPage() { // <-- নিশ্চিত করুন export default আছে
  // TODO: Fetch user's orders using useEffect or Server Component props
  const [orders, setOrders] = useState<Order[]>(demoOrders); // Use Order type

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        My Orders
      </h3>

      {/* Content */}
      {orders.length === 0 ? (
        // Empty Orders View
        <div className="text-center text-gray-500 py-20">
          <Archive size={48} className="mx-auto mb-4" />
          <p className="text-lg">You haven't placed any orders yet.</p>
          <Button asChild variant="link" className="text-green-600 mt-2">
              <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        // Orders Table View
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <Table>
            <TableCaption className="py-4">Your recent order history.</TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 w-[150px]">Order #</TableHead> {/* Fixed width */}
                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Total</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center w-[150px]">Actions</TableHead> {/* Fixed width */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">৳ {order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {/* Link to a potential user-specific order detail page */}
                    {/* TODO: Create the /dashboard/orders/[orderId] page */}
                    <Button variant="outline" size="sm" asChild>
                       {/* Using order.id (MongoDB ID) for the URL param */}
                       <Link href={`/dashboard/orders/${order.id}`}>
                        <Eye size={16} className="mr-2" /> View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
       {/* TODO: Add Pagination if needed */}
    </div>
  );
} // <--- নিশ্চিত করুন ফাংশন বডি এখানে শেষ হচ্ছে