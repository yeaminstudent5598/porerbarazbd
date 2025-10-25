// app/(admin)/admin/orders/[orderId]/page.tsx
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
  TableFooter
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Printer,
  Truck,
  Check,
  Package as PackageIcon, // Renamed
  Info,
  Loader2
} from 'lucide-react';

// --- Type Definitions ---
interface OrderItem { id: number | string; productId?: string | number; name: string; imageUrl?: string; price: number; quantity: number; }
interface CustomerInfo { id: string; name: string; email: string; phone?: string; }
interface AddressInfo { name: string; address: string; city?: string; zip?: string; phone?: string; }
interface PaymentInfo { method: string; status: 'Pending' | 'Paid' | 'Failed' | 'Refunded'; transactionId?: string; }
type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
interface OrderDetail {
    id: string; // User-friendly ID like #PORER-1052
    orderDbId: string; // Actual DB ID
    date: string;
    status: OrderStatus;
    customer: CustomerInfo;
    shippingAddress: AddressInfo;
    payment: PaymentInfo;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    notes?: string;
}
// --- End Type Definitions ---

// === Demo Data (Replace with API call) ===
// Ensure these keys EXACTLY match the format passed in the URL after decoding
// === Demo Data Fetching Function (Replace with actual API call) ===
// Find order by the user-friendly ID (#PORER-...)
const demoOrdersData: { [key: string]: OrderDetail } = {
  // --- নিশ্চিত করুন key গুলো EXACTLY '#PORER-XXXX' ফরম্যাটে আছে ---
  "#PORER-1052": {
    id: "#PORER-1052", // <-- এই ভ্যালু ম্যানেজ পেজের সাথে মিলতে হবে
    orderDbId: "67890def1234567890abcdef", date: "2025-10-20T10:30:00Z", status: "Delivered",
    customer: { id: "CUST-001", name: "সাদিয়া ইসলাম", email: "sadia@example.com", phone: "+8801712345678" },
    shippingAddress: { name: "সাদিয়া ইসলাম", address: "House 123, Road 4, Block B, Basundhara R/A", city: "Dhaka", zip: "1229", phone: "+8801712345678" },
    payment: { method: "Cash on Delivery", status: "Paid" },
    items: [
      { id: 1, productId: 1, name: "কালোজিরা আচার", imageUrl: "...", price: 890, quantity: 1 },
      { id: 5, productId: 5, name: "ঝিনুক পিঠা", imageUrl: "...", price: 590, quantity: 1 },
    ], subtotal: 1480.00, shipping: 50.00, total: 1530.00, notes: "Please deliver after 5 PM."
  },
   "#PORER-1051": {
    id: "#PORER-1051", // <-- এই ভ্যালু ম্যানেজ পেজের সাথে মিলতে হবে
    orderDbId: "abcdef1234567890abcdef12", date: "2025-10-20T09:15:00Z", status: "Processing",
    customer: { id: "CUST-002", name: "আরিফুর রহমান", email: "arifur@example.com", phone: "+8801812345679" },
    shippingAddress: { name: "আরিফুর রহমান", address: "Level 5, ABC Tower, Gulshan 1", city: "Dhaka", zip: "1212", phone: "+8801812345679" },
    payment: { method: "bKash", status: "Paid", transactionId: "BK123XYZ" },
    items: [ { id: 3, productId: 3, name: "রসুনের আচার", imageUrl: "...", price: 890, quantity: 1 } ],
    subtotal: 890.00, shipping: 50.00, total: 940.00
  },
  "#PORER-1050": {
    id: "#PORER-1050", // <-- এই ভ্যালু ম্যানেজ পেজের সাথে মিলতে হবে
    orderDbId: "1234567890abcdef12345678", date: "2025-10-19T14:00:00Z", status: "Pending",
    customer: { id: "CUST-003", name: "নাসরিন সুলতানা", email: "nasrin@example.com", phone: "+8801912345670" },
    shippingAddress: { name: "নাসরিন সুলতানা", address: "12/A, Road 5, Khulna", city: "Khulna", zip: "9100", phone: "+8801912345670" },
    payment: { method: "Cash on Delivery", status: "Pending" },
    items: [ { id: 9, productId: 9, name: "গোজাপ ফুল পিঠা", imageUrl: "...", price: 590, quantity: 2 } ],
    subtotal: 1180.00, shipping: 60.00, total: 1240.00
  },
  // --- অন্যান্য ডেমো অর্ডার ---
};

// Mock fetch function
const fetchOrderById = async (id: string): Promise<OrderDetail | null> => {
    console.log(`[fetchOrderById] Received ID (encoded?): ${id}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    const decodedId = decodeURIComponent(id);
    console.log(`[fetchOrderById] Decoded ID for lookup: ${decodedId}`);
    if (demoOrdersData.hasOwnProperty(decodedId)) {
        console.log(`[fetchOrderById] Data found for key: ${decodedId}`);
        return demoOrdersData[decodedId];
    } else {
        console.log(`[fetchOrderById] No data found for key: ${decodedId}`);
        console.log('[fetchOrderById] Available keys:', Object.keys(demoOrdersData));
        return null;
    }
};
// =============================================================

// Status Badge Component
const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
        case 'Delivered': return <Badge className="bg-green-100 text-green-700 border-green-200">{status}</Badge>;
        case 'Shipped': return <Badge className="bg-purple-100 text-purple-700 border-purple-200">{status}</Badge>;
        case 'Processing': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{status}</Badge>;
        case 'Pending': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">{status}</Badge>;
        case 'Cancelled': return <Badge variant="destructive">{status}</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
};

// Payment Status Badge Component
const getPaymentStatusBadge = (status: PaymentInfo['status']) => {
    switch (status) {
        case 'Paid': return <Badge className="bg-green-100 text-green-700">{status}</Badge>;
        case 'Pending': return <Badge className="bg-yellow-100 text-yellow-700">{status}</Badge>;
        case 'Failed': return <Badge variant="destructive">{status}</Badge>;
        case 'Refunded': return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
}

export default function OrderDetailPage() {
    const params = useParams();
    // Ensure orderId is treated as string, handle potential array from params
    const orderId = typeof params.orderId === 'string' ? params.orderId : Array.isArray(params.orderId) ? params.orderId[0] : undefined;
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        if (!orderId) {
            console.log("Order ID is missing from URL params.");
            setIsLoading(false);
            notFound(); // Trigger 404 if no ID
            return;
        };

        setIsLoading(true);
        console.log("useEffect triggered with orderId:", orderId);

        fetchOrderById(orderId)
            .then(data => {
                console.log("Data found:", data);
                if (!data) {
                    console.error("fetchOrderById returned null, triggering notFound()");
                    notFound(); // Trigger 404 if order not found
                } else {
                    console.log("Setting order state with fetched data:", data);
                    setOrder(data);
                }
            })
            .catch(error => {
                console.error("Failed to fetch order in useEffect:", error);
                setOrder(null); // Indicate error state
            })
            .finally(() => {
                console.log("Finished fetching, setting isLoading to false.");
                setIsLoading(false);
            });
    }, [orderId]); // Dependency array includes orderId

    const handleUpdateStatus = async (newStatus: OrderStatus) => {
        if (!order) return;
        setIsUpdatingStatus(true);
        console.log(`Updating order ${order.orderDbId} status to ${newStatus}`);
        // TODO: Call API here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
        setOrder(prev => prev ? { ...prev, status: newStatus } : null);
        setIsUpdatingStatus(false);
    }

    // --- Render Logic ---
    if (isLoading || order === undefined) {
        return (
            <div className="flex items-center justify-center p-10 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading order details...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-600 mb-4">Failed to load order details or order not found for ID: {decodeURIComponent(orderId || 'N/A')}.</p>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft size={16} className="mr-2" /> Back to Orders
                </Button>
            </div>
        );
    }
    // If we reach here, 'order' is guaranteed to be OrderDetail

    const formattedDate = new Date(order.date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b pb-4 mb-2 print:border-none print:mb-0">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0 print:hidden" onClick={() => router.back()}>
                        <ArrowLeft size={16} /> <span className="sr-only">Back</span>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-2">
                            Order <span className="text-green-700">{order.id}</span>
                            {getStatusBadge(order.status)}
                        </h2>
                        <p className="text-xs text-gray-500"> Placed on: {formattedDate} </p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap sm:ml-auto print:hidden">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                        <Printer size={16} className="mr-2" /> Print Invoice
                    </Button>
                </div>
            </div>

            {/* Order Actions Card */}
            <Card className="print:hidden">
                <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Truck size={18}/> Update Order Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {order.status === 'Pending' && (
                        <Button size="sm" onClick={() => handleUpdateStatus('Processing')} disabled={isUpdatingStatus} className="bg-blue-600 hover:bg-blue-700">
                            {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackageIcon size={16} className="mr-2" />} Mark as Processing
                        </Button>
                    )}
                    {order.status === 'Processing' && (
                         <Button size="sm" onClick={() => handleUpdateStatus('Shipped')} disabled={isUpdatingStatus} className="bg-purple-600 hover:bg-purple-700">
                             {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Truck size={16} className="mr-2" />} Mark as Shipped
                         </Button>
                    )}
                    {order.status === 'Shipped' && (
                        <Button size="sm" onClick={() => handleUpdateStatus('Delivered')} disabled={isUpdatingStatus} className="bg-green-600 hover:bg-green-700">
                            {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check size={16} className="mr-2" />} Mark as Delivered
                        </Button>
                    )}
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus('Cancelled')} disabled={isUpdatingStatus}>
                            {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Cancel Order
                        </Button>
                    )}
                    {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                        <p className="text-sm text-muted-foreground italic flex items-center gap-2"> <Info size={14}/> No further status actions available. </p>
                    )}
                </CardContent>
            </Card>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start print:grid-cols-3 print:gap-4">

                {/* Column 1: Items & Notes */}
                <div className="md:col-span-2 space-y-6 print:col-span-2">
                    <Card className="print:shadow-none print:border-none">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold print:text-lg">
                                Order Items ({order.items.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="print:text-xs">
                                        <TableHead className="w-[60px] hidden sm:table-cell pl-6 print:hidden">Img</TableHead>
                                        <TableHead className="sm:pl-0 print:pl-0">Product</TableHead>
                                        <TableHead className="text-center w-[80px]">Qty</TableHead>
                                        <TableHead className="text-right w-[100px]">Unit Price</TableHead>
                                        <TableHead className="text-right w-[120px] pr-6 print:pr-0">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id} className="print:text-xs">
                                            <TableCell className="hidden sm:table-cell pl-6 py-2 print:hidden">
                                                <img src={item.imageUrl || "https://via.placeholder.com/48"} alt={item.name} className="w-12 h-12 rounded object-cover border" width={48} height={48} />
                                            </TableCell>
                                            <TableCell className="sm:pl-0 py-2 print:pl-0">
                                                <Link href={`/admin/products/edit/${item.productId || item.id}`} className="font-medium text-sm text-blue-600 hover:underline print:text-black print:no-underline">
                                                    {item.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-center text-sm py-2">x {item.quantity}</TableCell>
                                            <TableCell className="text-right text-sm py-2">৳ {item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right text-sm font-medium pr-6 py-2 print:pr-0">৳ {(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter className="bg-gray-50/50 dark:bg-gray-800/50 text-sm print:bg-transparent">
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right font-medium pr-6 py-2 print:col-span-4 print:border-t">Subtotal</TableCell>
                                        <TableCell className="text-right font-medium pr-6 py-2 print:pr-0 print:border-t">৳ {order.subtotal.toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right pr-6 py-2 print:col-span-4">Shipping</TableCell>
                                        <TableCell className="text-right pr-6 py-2 print:pr-0">৳ {order.shipping.toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow className="text-base font-bold bg-gray-100 dark:bg-gray-700 print:bg-gray-100">
                                        <TableCell colSpan={4} className="text-right pr-6 py-3 print:col-span-4">Grand Total</TableCell>
                                        <TableCell className="text-right pr-6 py-3 print:pr-0">৳ {order.total.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                    {order.notes && (
                        <Card className="print:shadow-none print:border print:mt-4">
                            <CardHeader className="print:pb-2">
                                <CardTitle className="text-base font-semibold flex items-center gap-2 print:text-sm">
                                    <Info size={16}/> Customer Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="print:pt-0"><p className="text-sm text-gray-600 italic">"{order.notes}"</p></CardContent>
                        </Card>
                    )}
                </div>

                {/* Column 2: Customer, Shipping, Payment */}
                <div className="md:col-span-1 space-y-6 print:col-span-1">
                    <Card className="print:shadow-none print:border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 print:pb-1">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 print:text-sm">
                                <User size={16}/> Customer
                            </CardTitle>
                            <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs print:hidden">
                                <Link href={`/admin/customers/${order.customer.id}`}>View Profile</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm pt-2 print:text-xs">
                            <p className="font-medium text-gray-800">{order.customer.name}</p>
                            <p className="text-gray-600 break-all">{order.customer.email}</p>
                            {order.customer.phone && <p className="text-gray-600">{order.customer.phone}</p>}
                        </CardContent>
                    </Card>
                    <Card className="print:shadow-none print:border">
                        <CardHeader className="print:pb-2">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 print:text-sm">
                                <MapPin size={16}/> Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm text-gray-600 leading-relaxed print:text-xs">
                            <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            {order.shippingAddress.city && <p>{order.shippingAddress.city}{order.shippingAddress.zip && `, ${order.shippingAddress.zip}`}</p>}
                            {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                        </CardContent>
                    </Card>
                    <Card className="print:shadow-none print:border">
                        <CardHeader className="print:pb-2">
                             <CardTitle className="text-base font-semibold flex items-center gap-2 print:text-sm">
                                 <CreditCard size={16}/> Payment
                             </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm print:text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method:</span>
                                <span className="font-medium">{order.payment.method}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Status:</span>
                                {getPaymentStatusBadge(order.payment.status)}
                            </div>
                            {order.payment.transactionId && (
                                <div className="flex flex-col sm:flex-row sm:justify-between pt-2 border-t mt-2">
                                    <span className="text-gray-500 text-xs">Trans.ID:</span>
                                    <span className="font-mono text-xs text-muted-foreground break-all">{order.payment.transactionId}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

             {/* Print Only Footer */}
             <div className="hidden print:block mt-12 text-center text-xs text-gray-500 border-t pt-4">
                <p>Thank you for your order from Porer Bazar BD!</p>
                {/* TODO: Add your actual domain */}
                <p>Visit us online: www.porerbazarbd.com</p>
            </div>

        </div> // End of outer div
    );
}