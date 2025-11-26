'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/app/lib/fetcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Minus, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const token = (session as any)?.accessToken;

    const { data: cartRes, isLoading } = useSWR(token ? '/api/v1/cart' : null, (url) => fetcher(url, token));
    const cart = cartRes?.data;

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    // Checkout Form State
    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '',
        address: '',
        city: 'Dhaka',
        zip: ''
    });

    // --- Cart Actions ---
    const updateQty = async (productId: string, type: 'increment' | 'decrement') => {
        try {
            await fetch('/api/v1/cart', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ productId, type })
            });
            mutate('/api/v1/cart');
        } catch (e) { toast.error("Failed to update"); }
    };

    const removeItem = async (productId: string) => {
        try {
            await fetch('/api/v1/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ productId })
            });
            mutate('/api/v1/cart');
            toast.success("Item removed");
        } catch (e) { toast.error("Failed to remove"); }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cart || cart.items.length === 0) return;

        setIsCheckingOut(true);
        try {
            // Prepare Order Payload
            const orderPayload = {
                customerInfo: formData,
                items: cart.items.map((item: any) => ({
                    product: item.product._id,
                    name: item.product.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.product.imageUrl
                })),
                totalAmount: cart.totalPrice + 60, // + Shipping
                paymentMethod: 'COD'
            };

            const res = await fetch('/api/v1/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(orderPayload)
            });

            if (!res.ok) throw new Error("Order failed");
            
            toast.success("Order placed successfully!");
            router.push('/profile'); // Or order success page
            // Ideally clear cart here (need API support or manual delete loop)
        } catch (err) {
            toast.error("Failed to place order");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (!session) return <div className="py-20 text-center"><p>Please login to view cart</p><Button asChild className="mt-4"><a href="/auth/login">Login</a></Button></div>;
    if (isLoading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin"/></div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="py-20 text-center flex flex-col items-center">
                <ShoppingBag size={64} className="text-gray-300 mb-4"/>
                <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
                <Button asChild className="mt-6 bg-green-600"><a href="/products">Continue Shopping</a></Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item: any) => (
                        <Card key={item._id}>
                            <CardContent className="p-4 flex gap-4 items-center">
                                <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover"/>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    <p className="text-green-600 font-medium">৳ {item.price}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border rounded">
                                        <button onClick={() => updateQty(item.product._id, 'decrement')} className="px-2 py-1 hover:bg-gray-100"><Minus size={14}/></button>
                                        <span className="px-2 text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQty(item.product._id, 'increment')} className="px-2 py-1 hover:bg-gray-100"><Plus size={14}/></button>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.product._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 size={18}/>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Checkout Form & Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span>Subtotal</span><span>৳ {cart.totalPrice}</span></div>
                                <div className="flex justify-between"><span>Shipping (Flat)</span><span>৳ 60</span></div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span>৳ {cart.totalPrice + 60}</span></div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold">Shipping Details</h3>
                                <div className="grid gap-3">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="017..." required/>
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Full Address</Label>
                                        <Input id="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="House, Road, Area" required/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                        </div>
                                        <div>
                                            <Label htmlFor="zip">Zip Code</Label>
                                            <Input id="zip" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" onClick={handlePlaceOrder} disabled={isCheckingOut}>
                                {isCheckingOut ? <Loader2 className="animate-spin mr-2"/> : <ArrowRight className="mr-2" size={18}/>}
                                Place COD Order
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}