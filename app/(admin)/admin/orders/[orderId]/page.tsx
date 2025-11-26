'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { ArrowLeft, User, MapPin, CreditCard, Printer, Truck, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useSession } from 'next-auth/react'; // ✅ ১. useSession ইম্পোর্ট করুন

// Helper for Status Badge
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

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.orderId as string;
    const router = useRouter();
    
    // ✅ ২. localStorage বাদ দিয়ে useSession ব্যবহার করুন
    const { data: session, status } = useSession();
    const token = (session as any)?.accessToken;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        // সেশন লোডিং শেষ হওয়া পর্যন্ত অপেক্ষা করুন
        if (status === 'loading') return;

        if (!token) {
             setError("Unauthorized: Please login as admin");
             setLoading(false);
             return;
        }

        if (!orderId) return;

        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/v1/orders/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if(!res.ok) throw new Error(data.message || "Failed to load");
                setOrder(data.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, token, status]);

    const handleUpdateStatus = async (newStatus: string) => {
        if (!token) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/v1/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);
            
            setOrder(data.data); // UI আপডেট করুন
            toast.success(`Order updated to ${newStatus}`);
        } catch (err: any) {
            toast.error(err.message || "Update failed");
        } finally {
            setUpdating(false);
        }
    };

    if (status === 'loading' || loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin h-8 w-8"/></div>;
    if (error) return <div className="p-6 text-center text-red-500"><AlertTriangle className="mx-auto h-10 w-10"/> {error}</div>;
    if (!order) return null;

    const formatOrderId = (id: string) => `#ORD-${id.slice(-6).toUpperCase()}`;

    return (
        <div className="flex flex-col gap-6 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => router.back()}><ArrowLeft size={16}/></Button>
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            Order <span className="text-green-700">{formatOrderId(order._id)}</span>
                            {getStatusBadge(order.status)}
                        </h2>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
                    <Printer size={16} className="mr-2"/> Print Invoice
                </Button>
            </div>

            {/* Action Buttons */}
            <Card className="print:hidden">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Truck size={18}/> Update Status</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {order.status === 'Pending' && <Button size="sm" onClick={() => handleUpdateStatus('Processing')} disabled={updating} className="bg-blue-600">Processing</Button>}
                    {order.status === 'Processing' && <Button size="sm" onClick={() => handleUpdateStatus('Shipped')} disabled={updating} className="bg-purple-600">Shipped</Button>}
                    {order.status === 'Shipped' && <Button size="sm" onClick={() => handleUpdateStatus('Delivered')} disabled={updating} className="bg-green-600">Delivered</Button>}
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus('Cancelled')} disabled={updating}>Cancel</Button>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Items ({order.items.length})</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item: any, idx: number) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {item.image && <Image src={item.image} alt={item.name} width={40} height={40} className="rounded border object-cover"/>}
                                                    {item.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">x{item.quantity}</TableCell>
                                            <TableCell className="text-right">৳ {item.price}</TableCell>
                                            <TableCell className="text-right font-semibold">৳ {item.price * item.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right">Subtotal</TableCell>
                                        <TableCell className="text-right">৳ {order.totalAmount - order.shippingCost}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right">Shipping</TableCell>
                                        <TableCell className="text-right">৳ {order.shippingCost}</TableCell>
                                    </TableRow>
                                    <TableRow className="text-lg font-bold">
                                        <TableCell colSpan={3} className="text-right">Grand Total</TableCell>
                                        <TableCell className="text-right">৳ {order.totalAmount}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                    {order.notes && <Card><CardContent className="pt-6"><p className="italic text-gray-600">Note: "{order.notes}"</p></CardContent></Card>}
                </div>

                {/* Customer Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base flex gap-2"><User size={16}/> Customer</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-1">
                            <p className="font-semibold">{order.customerInfo.name}</p>
                            <p>{order.customerInfo.phone}</p>
                            <p>{order.customerInfo.email}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-base flex gap-2"><MapPin size={16}/> Shipping</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-1">
                            <p>{order.customerInfo.address}</p>
                            <p>{order.customerInfo.city} - {order.customerInfo.zip}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-base flex gap-2"><CreditCard size={16}/> Payment</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div className="flex justify-between"><span>Method:</span> <span className="font-bold">{order.paymentMethod}</span></div>
                            <div className="flex justify-between">
                                <span>Status:</span> 
                                <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'secondary'}>{order.paymentStatus}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}