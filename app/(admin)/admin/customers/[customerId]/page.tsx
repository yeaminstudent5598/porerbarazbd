// app/(admin)/admin/customers/[customerId]/page.tsx
'use client'; // Required for useParams, useRouter, useState, useEffect

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation'; // Import notFound for 404
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Phone, MapPin, DollarSign, Archive, UserX, Edit, Home } from 'lucide-react'; // Added Edit
import {
    AlertDialog, // For Disable Confirmation
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from '@radix-ui/react-separator';


// --- Define Customer Detail Type (more comprehensive) ---
interface Order {
    id: string; // Order ID like "#EFOODS-1052"
    orderDbId: string; // Actual DB ID like MongoDB ObjectId
    date: string;
    status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
    total: number;
}
interface Address {
    id: number | string; // Address ID if available
    type: string; // e.g., "Home", "Office"
    isDefault: boolean;
    address: string;
    city?: string;
    zip?: string;
}
interface CustomerDetail {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    joinedDate: string;
    totalSpent: number;
    status?: 'Active' | 'Disabled'; // Added status
    addresses: Address[];
    orders: Order[];
}
// --- End Customer Detail Type ---


// === Demo Data Fetching Function (Replace with actual API call) ===
const demoCustomersData: { [key: string]: CustomerDetail } = {
  "CUST-001": {
    id: "CUST-001",
    name: "সাদিয়া ইসলাম",
    email: "sadia@example.com",
    phone: "+8801712345678",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250",
    joinedDate: "October 15, 2025",
    totalSpent: 4500.00,
    status: 'Active',
    addresses: [ { id: 1, type: "Home", isDefault: true, address: "House 123, Road 4, Block B, Basundhara R/A, Dhaka-1229" } ],
    orders: [
      { id: "#EFOODS-1052", orderDbId: "67890def1234567890abcdef", date: "October 20, 2025", status: "Delivered", total: 1480.00 },
      { id: "#EFOODS-1030", orderDbId: "fedcba0987654321fedcba09", date: "October 10, 2025", status: "Delivered", total: 3020.00 },
    ]
  },
  "CUST-002": {
    id: "CUST-002",
    name: "আরিফুর রহমান",
    email: "arifur@example.com",
    phone: "+8801812345679",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250",
    joinedDate: "October 10, 2025",
    totalSpent: 1890.00,
    status: 'Active',
    addresses: [ { id: 2, type: "Office", isDefault: true, address: "Level 5, ABC Tower, Gulshan 1, Dhaka-1212" } ],
    orders: [ { id: "#EFOODS-1051", orderDbId: "abcdef1234567890abcdef12", date: "October 20, 2025", status: "Processing", total: 890.00 } ]
  }
  // Add other customers...
};

const fetchCustomerById = async (id: string): Promise<CustomerDetail | null> => {
    console.log(`Fetching customer with ID: ${id}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return demoCustomersData[id] || null;
};
// =============================================================

// Status Badge (same as orders page)
const getOrderStatusBadge = (status: Order['status']) => {
  switch (status) {
    case 'Delivered': return <Badge className="bg-green-100 text-green-700">{status}</Badge>;
    case 'Processing': return <Badge className="bg-blue-100 text-blue-700">{status}</Badge>;
    case 'Pending': return <Badge className="bg-yellow-100 text-yellow-700">{status}</Badge>;
    case 'Cancelled': return <Badge variant="destructive">{status}</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};


export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.customerId as string; // Extract ID (assert as string)
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetail | null | undefined>(undefined); // undefined for loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return; // Skip if ID is not available yet

    setIsLoading(true);
    fetchCustomerById(customerId)
      .then(data => {
        if (!data) {
          notFound(); // Trigger Next.js 404 page if customer not found
        } else {
          setCustomer(data);
        }
      })
      .catch(error => {
        console.error("Failed to fetch customer:", error);
        // Optionally show an error message state
        setCustomer(null); // Indicate error state
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [customerId]); // Re-fetch if ID changes

  // TODO: Implement disable functionality
  const handleDisable = () => {
      if(!customer) return;
      console.log("Attempting to disable customer:", customer.id);
      alert(`Customer ${customer.name} disable action triggered!`);
      // Call API to update customer status
      // Then potentially update state: setCustomer(prev => prev ? {...prev, status: 'Disabled'} : null);
  }

  // Loading State
  if (isLoading || customer === undefined) {
    return <div className="container mx-auto p-6 text-center text-gray-500">Loading customer details...</div>;
  }

  // Error State (Could be more elaborate)
  if (!customer) {
     return <div className="container mx-auto p-6 text-center text-red-500">Failed to load customer details.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header: Back Button, Title, Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} className="mr-2" /> Back to Customers
        </Button>
        <div className="flex gap-2">
            {/* TODO: Add Edit Customer functionality */}
            <Button variant="outline" size="sm">
                <Edit size={16} className="mr-2" /> Edit Customer
            </Button>
            <AlertDialog>
                 <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <UserX size={16} className="mr-2" />
                        {customer.status === 'Disabled' ? 'Enable Account' : 'Disable Account'}
                    </Button>
                 </AlertDialogTrigger>
                {/* Disable/Enable Confirmation */}
                 <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will {customer.status === 'Disabled' ? 're-enable' : 'disable'} the account for "{customer.name}".
                        {customer.status !== 'Disabled' && " They may lose access."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDisable}
                        className={customer.status === 'Disabled' ? 'bg-green-600 hover:bg-green-700' : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'}
                      >
                        Yes, {customer.status === 'Disabled' ? 'Enable' : 'Disable'} Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Column 1: Customer Profile & Contact */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Profile Card */}
          <Card>
             <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                      <CardTitle className="text-xl">{customer.name}</CardTitle>
                      <CardDescription>{customer.id}</CardDescription>
                      <Badge variant={customer.status === 'Active' ? 'default' : 'destructive'}
                         className={`mt-1 ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : ''}`}
                       >
                         {customer.status || 'Unknown'}
                       </Badge>
                  </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">Customer since {customer.joinedDate}</p>
                <Separator/>
                <div className="flex items-center gap-3 pt-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-gray-700 break-all">{customer.email}</span>
                </div>
                {customer.phone && (
                    <div className="flex items-center gap-3">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-gray-700">{customer.phone}</span>
                    </div>
                )}
            </CardContent>
          </Card>

          {/* Saved Addresses */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses ({customer.addresses.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.addresses.length === 0 ? (
                 <p className="text-sm text-muted-foreground">No saved addresses found.</p>
              ) : (
                customer.addresses.map(addr => (
                    <div key={addr.id} className="text-sm text-gray-600 border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                            {addr.type === "Home" ? <Home size={16} /> : <MapPin size={16} />}
                            {addr.type} Address
                         </p>
                        {addr.isDefault && <Badge variant="outline" className="text-xs">Default</Badge>}
                    </div>
                    <p>{addr.address}</p>
                    {addr.city && <p>{addr.city}{addr.zip && `, ${addr.zip}`}</p>}
                    </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Order History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Total Spent: <span className="font-bold text-green-700">৳ {customer.totalSpent.toFixed(2)}</span> ({customer.orders.length} Orders)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customer.orders.length === 0 ? (
                 <p className="text-sm text-muted-foreground text-center py-10">This customer hasn't placed any orders yet.</p>
              ) : (
                 <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800">
                        <TableRow>
                            <TableHead className="w-[150px]">Order #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {customer.orders.map((order) => (
                            <TableRow key={order.id}>
                            <TableCell>
                                <Link href={`/admin/orders/${encodeURIComponent(order.id)}`} className="font-medium text-blue-600 hover:underline">
                                {order.id}
                                </Link>
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                            <TableCell className="text-right">৳ {order.total.toFixed(2)}</TableCell>
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