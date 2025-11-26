'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/fetcher';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  LogOut, 
  Loader2, 
  ShoppingBag,
  Edit,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// স্ট্যাটাস ব্যাজ হেল্পার
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Delivered': return <Badge className="bg-green-100 text-green-700 border-green-200">Delivered</Badge>;
    case 'Processing': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Processing</Badge>;
    case 'Cancelled': return <Badge variant="destructive">Cancelled</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // টাইপ সেফটির জন্য সেশন থেকে টোকেন নেওয়া
  const token = (session as any)?.accessToken;

  // --- State ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '', 
    address: ''
  });

  // --- Data Fetching ---
  
  // ১. প্রোফাইল ডাটা ফেচিং
  const { data: profileRes, isLoading: profileLoading, mutate: mutateProfile } = useSWR(
    token ? '/api/v1/users/profile' : null, 
    (url) => fetcher(url, token)
  );

  // ২. অর্ডার ডাটা ফেচিং
  const { data: ordersRes, isLoading: ordersLoading } = useSWR(
    token ? '/api/v1/users/orders' : null, 
    (url) => fetcher(url, token)
  );

  const user = profileRes?.data;
  const orders = ordersRes?.data || [];

  // ইউজার ডাটা লোড হলে ফর্ম আপডেট করা
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '', 
        address: user.address || '' 
      });
    }
  }, [user]);

  // --- Handlers ---
  
  // প্রোফাইল আপডেট হ্যান্ডলার
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Update failed");
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      mutateProfile(); // ডাটা রিফ্রেশ
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // লগআউট হ্যান্ডলার
  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  // --- Auth Check ---
  if (status === 'loading' || profileLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-green-600"/></div>;
  }

  // সেশন না থাকলে লগইনে রিডাইরেক্ট
  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* বাম পাশের সাইডবার: ইউজার ইনফো কার্ড */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="bg-green-600 h-24 relative">
                <div className="absolute -bottom-12 left-6 p-1 bg-white rounded-full">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white overflow-hidden">
                        <User size={40} className="text-gray-400"/>
                    </div>
                </div>
            </div>
            <CardHeader className="pt-14 pb-4 px-6">
                <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
                <Badge variant="secondary" className="w-fit mt-2 capitalize">{user?.role}</Badge>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut size={16} className="mr-2"/> Logout
                </Button>
            </CardContent>
          </Card>
        </div>

        {/* ডান পাশের কন্টেন্ট: প্রোফাইল এবং অর্ডার ট্যাব */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>

            {/* --- Tab: Profile --- */}
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : <><Edit size={16} className="mr-2"/> Edit</>}
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user?.email} disabled className="bg-gray-50"/>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Example: 017..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Your full address"
                      />
                    </div>
                    
                    {isEditing && (
                      <Button type="submit" className="bg-green-600 hover:bg-green-700 mt-2">
                        <Save size={16} className="mr-2"/> Save Changes
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- Tab: Orders --- */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Check the status of your recent purchases.</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="py-10 flex justify-center"><Loader2 className="animate-spin"/></div>
                  ) : orders.length === 0 ? (
                    <div className="py-10 text-center text-gray-500 flex flex-col items-center">
                        <ShoppingBag size={48} className="mb-4 opacity-20"/>
                        <p>No orders found.</p>
                        <Button variant="link" onClick={() => router.push('/products')}>Start Shopping</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">#ORD-{order._id.slice(-6).toUpperCase()}</span>
                                    {getStatusBadge(order.status)}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Items
                                </p>
                                <p className="text-sm font-medium text-green-700">Total: ৳ {order.totalAmount}</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {/* ছোট থাম্বনেইল ইমেজ */}
                                <div className="flex -space-x-2 overflow-hidden">
                                    {order.items.slice(0,3).map((item: any, i: number) => (
                                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 overflow-hidden relative">
                                            {item.product?.imageUrl && (
                                                <Image 
                                                    src={item.product.imageUrl} 
                                                    alt="item" 
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {/* ইউজার অর্ডারের জন্য আলাদা ডিটেইলস পেজ থাকলে লিংক দিতে পারেন, এখানে বাটন ডিজেবল রাখা হলো অ্যাডমিন প্যানেলের সাথে কনফ্লিক্ট এড়াতে */}
                                <Button size="sm" variant="outline" disabled> 
                                    Details
                                </Button>
                            </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}