// app/(admin)/admin/customers/page.tsx
'use client'; // For potential state if filtering/pagination is added client-side

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator, // Corrected import
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserX, Eye, Search } from 'lucide-react'; // Added Search icon
import { Input } from '@/components/ui/input'; // For search
import Link from 'next/link';
import {
    AlertDialog, // For Delete Confirmation
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import Card components

// Define Customer type (adjust based on your actual data)
interface Customer {
    id: string; // User ID (e.g., MongoDB ObjectId as string)
    name: string;
    email: string;
    avatar?: string; // Optional avatar URL
    totalOrders: number;
    totalSpent: number;
    joinedDate: string; // Or Date object
    // Add status (e.g., 'Active', 'Disabled') if needed
}

// TODO: Fetch this data from your API (ideally using Server Component or useEffect)
const demoCustomers: Customer[] = [
  {
    id: "CUST-001", // Use actual IDs later
    name: "সাদিয়া ইসলাম",
    email: "sadia@example.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250",
    totalOrders: 5,
    totalSpent: 4500.00,
    joinedDate: "Oct 15, 2025",
  },
  {
    id: "CUST-002",
    name: "আরিফুর রহমান",
    email: "arifur@example.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250",
    totalOrders: 2,
    totalSpent: 1890.00,
    joinedDate: "Oct 10, 2025",
  },
  {
    id: "CUST-003",
    name: "নাসরিন সুলতানা",
    email: "nasrin@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250",
    totalOrders: 1,
    totalSpent: 590.00,
    joinedDate: "Sep 25, 2025",
  },
  {
    id: "CUST-004",
    name: "কামাল আহমেদ",
    email: "kamal@example.com",
    avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=250",
    totalOrders: 3,
    totalSpent: 2750.00,
    joinedDate: "Sep 12, 2025",
  },
];

export default function ManageCustomersPage() {
  // TODO: Implement actual data fetching, search, filtering, and pagination
  const [customers, setCustomers] = useState<Customer[]>(demoCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  // Example filter logic (apply this on fetched data)
  const filteredCustomers = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // TODO: Implement disable functionality
  const handleDisable = (customerId: string) => {
      console.log("Attempting to disable customer:", customerId);
      alert(`Customer ${customerId} disable action triggered!`);
      // Call API to update customer status
  }


  return (
    <div className="flex flex-col gap-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Manage Customers</h2>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Optional: Add "Export" or other buttons here */}
      </div>

      {/* Customer Table */}
      <Card>
           <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>View and manage customer accounts.</CardDescription>
          </CardHeader>
           <CardContent>
             <div className="border rounded-lg overflow-hidden">
                <Table>
                {/* <TableCaption>List of registered customers.</TableCaption> */}
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 w-[40%]">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell text-center">Orders</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Total Spent</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCustomers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No customers found{searchTerm ? ' matching your search' : ''}.
                            </TableCell>
                        </TableRow>
                    )}
                    {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                        {/* Customer Cell */}
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9"> {/* Slightly smaller Avatar */}
                            <AvatarImage src={customer.avatar} alt={customer.name} />
                            <AvatarFallback>
                                {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="font-medium text-sm">{customer.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{customer.email}</p> {/* Show email on mobile here */}
                            </div>
                        </div>
                        </TableCell>
                        {/* Email Cell (Desktop) */}
                        <TableCell className="hidden md:table-cell text-sm">{customer.email}</TableCell>
                        {/* Orders Cell */}
                        <TableCell className="hidden sm:table-cell text-center text-sm">{customer.totalOrders}</TableCell>
                        {/* Total Spent Cell */}
                        <TableCell className="text-right text-sm">৳ {customer.totalSpent.toFixed(2)}</TableCell>
                        {/* Actions Cell */}
                        <TableCell className="text-center">
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Customer actions</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/customers/${customer.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                                        <UserX className="mr-2 h-4 w-4" /> Disable Account
                                    </DropdownMenuItem>
                                 </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* Disable Confirmation Dialog */}
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will disable the account for "{customer.name}". They might lose access temporarily or permanently depending on your system setup.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDisable(customer.id)}
                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                  >
                                    Yes, disable account
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                           </AlertDialog>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
              </div>
              {/* TODO: Add Pagination */}
           </CardContent>
      </Card>
    </div>
  );
}