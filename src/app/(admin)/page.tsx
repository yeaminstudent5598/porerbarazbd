// src/app/(admin)/admin/page.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'; // Added Users icon
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// TODO: Fetch this data from API
const dashboardStats = {
    revenue: 45231.89,
    revenueChange: "+20.1%",
    orders: 1250,
    ordersChange: "+18.1%",
    products: 573,
    productsChange: "+12",
    customers: 89,
    customersChange: "+5"
};

const AdminHomePage = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> {/* Changed grid cols */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳ {dashboardStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.revenueChange} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{dashboardStats.orders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.ordersChange} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.products}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.productsChange} since last week</p>
          </CardContent>
        </Card>
        <Card> {/* Added Customers Card */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.customers}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.customersChange} new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions or Recent Orders (Example) */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                      <Link href="/admin/products/add">Add Product</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                      <Link href="/admin/orders">View Orders</Link>
                  </Button>
                   <Button asChild variant="outline" size="sm">
                      <Link href="/admin/customers">View Customers</Link>
                  </Button>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest orders and sign-ups.</CardDescription>
              </CardHeader>
              <CardContent>
                  {/* TODO: Add a list of recent activities */}
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
              </CardContent>
          </Card>
      </div>

    </div>
  );
};

export default AdminHomePage;