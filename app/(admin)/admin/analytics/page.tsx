// app/(admin)/admin/analytics/page.tsx
'use client'; // Recharts requires Client Component

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  Rectangle, // For activeBar
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart, // Changed from LineChart
  Area,      // Changed from Line
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Package, Users, DollarSign, Activity } from 'lucide-react'; // Activity ইম্পোর্ট করা আছে

// =============================================================
// === টাইপস্ক্রিপ্ট এরর সমাধান (TooltipProps) ===
// =============================================================

// Tooltip-এর জন্য একটি কাস্টম ইন্টারফেস ডিফাইন করা
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[]; // payload-কে any[] হিসেবে গ্রহণ করা
  label?: string | number;
}

// =============================================================

// Demo data for Revenue Overview (Last 6 Months)
const salesData = [
  { name: 'May \'25', revenue: 40000, previous: 35000 },
  { name: 'June \'25', revenue: 30000, previous: 40000 },
  { name: 'July \'25', revenue: 52000, previous: 30000 },
  { name: 'Aug \'25', revenue: 48000, previous: 52000 },
  { name: 'Sep \'25', revenue: 61000, previous: 48000 },
  { name: 'Oct \'25', revenue: 75000, previous: 61000 },
];

// Demo data for Top Selling Products
const topProductsData = [
  { name: 'কালোজিরা আচার', sold: 120 },
  { name: 'ঝিনুক পিঠা', sold: 98 },
  { name: '১.৫ লিটার কম্বো', sold: 75 },
  { name: 'গোজাপ ফুল পিঠা', sold: 60 },
  { name: 'রসুনের আচার', sold: 45 },
];

// Demo Key Metrics
const keyMetrics = {
    conversionRate: 2.5, conversionChange: 0.2,
    avgOrderValue: 1150.75, avgOrderValueChange: -50.20,
    newCustomers: 35, newCustomersChange: 5,
};

// --- Custom Tooltip for Area Chart (এখন CustomTooltipProps ব্যবহার করছে) ---
const CustomAreaTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
            <span className="font-bold">{label}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
            <span className="font-bold text-green-600">
              {/* payload এখন any, তাই payload[0] চেক করা নিরাপদ */}
              ৳ {payload[0]?.value?.toLocaleString('en-IN') ?? 0}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// --- Custom Tooltip for Bar Chart (এখন CustomTooltipProps ব্যবহার করছে) ---
const CustomBarTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
         <p className="font-semibold text-sm mb-1">{label}</p>
         <p className="text-xs text-green-700">Sold: {payload[0]?.value ?? 0}</p>
      </div>
    );
  }
  return null;
};
// --- End Custom Tooltips ---


export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Sales & Product Analytics
        </h2>
        {/* TODO: Implement time range selection functionality */}
        <Select defaultValue="last6months">
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Time Range" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last6months">Last 6 Months</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
            </SelectContent>
        </Select>
      </div>

       {/* ===== Key Metrics Section ===== */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{keyMetrics.conversionRate}%</div>
                    <p className={`text-xs ${keyMetrics.conversionChange >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {keyMetrics.conversionChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                        {keyMetrics.conversionChange}% from last period
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳ {keyMetrics.avgOrderValue.toFixed(2)}</div>
                     <p className={`text-xs ${keyMetrics.avgOrderValueChange >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {keyMetrics.avgOrderValueChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                        ৳ {Math.abs(keyMetrics.avgOrderValueChange).toFixed(2)} from last period
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{keyMetrics.newCustomers}</div>
                    <p className={`text-xs ${keyMetrics.newCustomersChange >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {keyMetrics.newCustomersChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                        {keyMetrics.newCustomersChange} from last period
                    </p>
                </CardContent>
            </Card>
       </div>


      {/* ===== Charts Section ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* --- Revenue Area Chart (Larger) --- */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                 <TrendingUp className="h-5 w-5 text-green-600"/> Revenue Overview
            </CardTitle>
            <CardDescription>Sales performance trend.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={salesData}
                margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
              >
                 <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false}/>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis unit="৳" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={50}/>
                <Tooltip content={<CustomAreaTooltip />} cursor={{ fill: 'rgba(22, 163, 74, 0.1)' }}/>
                <Area
                  type="monotone"
                  dataKey="revenue"
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

        {/* --- Top Product Bar Chart (Smaller) --- */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                 <Package className="h-5 w-5 text-orange-500"/> Top Selling Products
            </CardTitle>
            <CardDescription>Quantity sold for top items.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProductsData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false}/>
                <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 10, width: 80 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                 />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(74, 222, 128, 0.1)' }}/>
                <Bar
                  dataKey="sold"
                  fill="#4ade80"
                  background={{ fill: '#f0f0f0', radius: 4 }}
                  radius={[0, 4, 4, 0]}
                  barSize={15}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}