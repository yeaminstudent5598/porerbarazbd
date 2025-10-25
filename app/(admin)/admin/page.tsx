// app/(admin)/admin/page.tsx
'use client'; // Recharts (চার্টের জন্য) ক্লায়েন্ট কম্পোনেন্ট প্রয়োজন

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter, // Footer যোগ করা হয়েছে
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // টেবিল ইম্পোর্ট
import { Badge } from '@/components/ui/badge'; // ব্যাজ ইম্পোর্ট
import { DollarSign, Package, ShoppingCart, Users, Activity, ListOrdered, TrendingUp, AlertTriangle, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps // কাস্টম টুলটিপের জন্য
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// TODO: এই সব ডেমো ডেটা API থেকে fetch করতে হবে
const dashboardStats = {
    revenue: 45231.89, revenueChange: "+20.1%",
    orders: 1250, ordersChange: "+18.1%",
    products: 573, productsChange: "+12",
    customers: 89, customersChange: "+5"
};

// গত ৭ দিনের সেলস ডেটা (চার্টের জন্য)
const salesData = [
  { date: 'Oct 19', "Revenue (৳)": 4000 },
  { date: 'Oct 20', "Revenue (৳)": 3000 },
  { date: 'Oct 21', "Revenue (৳)": 4500 },
  { date: 'Oct 22', "Revenue (৳)": 5200 },
  { date: 'Oct 23', "Revenue (৳)": 4800 },
  { date: 'Oct 24', "Revenue (৳)": 6100 },
  { date: 'Oct 25', "Revenue (৳)": 7500 },
];

// শেষ ৫টি অর্ডার
const recentOrders = [
  { id: "#PORER-1052", customer: "সাদিয়া ইসলাম", status: "Delivered", total: 1480.00, dbId: "67890def" },
  { id: "#PORER-1051", customer: "আরিফুর রহমান", status: "Processing", total: 890.00, dbId: "abcdef12" },
  { id: "#PORER-1050", customer: "নাসরিন সুলতানা", status: "Pending", total: 590.00, dbId: "12345678" },
  { id: "#PORER-1049", customer: "কামাল আহমেদ", status: "Cancelled", total: 1250.00, dbId: "fedcba98" },
];

// কম স্টক থাকা প্রোডাক্ট
const lowStockProducts = [
    { id: 5, name: "ঝিনুক পিঠা", stock: 0 },
    { id: 7, name: "১.৫ লিটার কম্বো", stock: 5 },
    { id: 2, name: "ঝুড়ি পিঠা", stock: 8 },
];

// অর্ডার স্ট্যাটাস ব্যাজ (ManageOrdersPage থেকে কপি)
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Delivered': return <Badge className="bg-green-100 text-green-700">{status}</Badge>;
    case 'Processing': return <Badge className="bg-blue-100 text-blue-700">{status}</Badge>;
    case 'Pending': return <Badge className="bg-yellow-100 text-yellow-700">{status}</Badge>;
    case 'Cancelled': return <Badge variant="destructive">{status}</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

// কাস্টম চার্ট টুলটিপ
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1">
          <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
          <span className="font-bold text-green-600">
            ৳ {payload[0].value?.toLocaleString('en-IN') ?? 0}
          </span>
        </div>
      </div>
    );
  }
  return null;
};


export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>

      {/* ===== Stat Cards (কালারফুল আইকন সহ) ===== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 bg-green-100 rounded-md"> {/* কালারফুল আইকন ব্যাকগ্রাউন্ড */}
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳ {dashboardStats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.revenueChange} from last month</p>
          </CardContent>
        </Card>
        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="p-2 bg-blue-100 rounded-md">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{dashboardStats.orders.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.ordersChange} from last month</p>
          </CardContent>
        </Card>
        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
             <div className="p-2 bg-orange-100 rounded-md">
                <Package className="h-4 w-4 text-orange-600" />
             </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.products}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.productsChange} since last week</p>
          </CardContent>
        </Card>
        {/* Total Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <div className="p-2 bg-purple-100 rounded-md">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.customers}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.customersChange} new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* ===== Main Dashboard Area (2-column layout) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* --- লেফট কলাম (চার্ট ও টেবিল) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* সেলস চার্ট */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Sales Overview (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={salesData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false}/>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis unit="৳" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(22, 163, 74, 0.1)' }} />
                  <Area
                    type="monotone"
                    dataKey="Revenue (৳)"
                    stroke="#16a34a"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                    activeDot={{ r: 5, strokeWidth: 1, fill: '#ffffff', stroke: '#16a34a' }}
                    dot={{ r: 3, fill: '#16a34a', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* রিসেন্ট অর্ডার টেবিল */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-blue-600" />
                Recent Orders
              </CardTitle>
              <CardDescription>The last 4 orders placed.</CardDescription>
            </CardHeader>
            <CardContent className="p-0"> {/* Padding 0 for full-width table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[50px] text-right pr-4">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{getStatusBadge(order.status as any)}</TableCell>
                      <TableCell className="text-right">৳ {order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right pr-4">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                          <Link href={`/admin/orders/${encodeURIComponent(order.id)}`} title="View Order">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-center border-t p-4">
               <Button asChild variant="outline" size="sm">
                  <Link href="/admin/orders">
                    View All Orders <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
               </Button>
            </CardFooter>
          </Card>
        </div>

        {/* --- রাইট কলাম (অ্যাকশন) --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* কুইক অ্যাকশন */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 justify-start">
                <Link href="/admin/products/add">
                  <Package className="mr-2 h-4 w-4"/> Add New Product
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/customers">
                  <Users className="mr-2 h-4 w-4"/> Manage Customers
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/analytics">
                  <TrendingUp className="mr-2 h-4 w-4"/> View Full Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* লো স্টক প্রোডাক্ট */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Items
              </CardTitle>
              <CardDescription>Products that need restocking soon.</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <ul className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <li key={product.id} className="flex items-center justify-between text-sm">
                      <div>
                        <Link href={`/admin/products/edit/${product.id}`} className="font-medium text-blue-600 hover:underline">
                          {product.name}
                        </Link>
                        {product.stock === 0 ? (
                            <p className="text-xs text-red-600 font-bold">OUT OF STOCK</p>
                        ) : (
                            <p className="text-xs text-muted-foreground">{product.stock} units left</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild className="h-8 px-2 text-xs">
                         <Link href={`/admin/products/edit/${product.id}`}>Manage</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No low stock items. Great job!</p>
              )}
            </CardContent>
             <CardFooter className="border-t pt-4">
                 <Button asChild variant="ghost" size="sm" className="w-full text-center text-xs text-muted-foreground">
                    <Link href="/admin/products">View All Products</Link>
                 </Button>
             </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}