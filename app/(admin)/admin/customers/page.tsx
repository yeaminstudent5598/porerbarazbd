import React from 'react';
import { UserService } from '@/modules/user/user.service';
import dbConnect from '@/app/lib/dbConnect';
import CustomerListClient from './CustomerListClient';

// Next.js Rules: এটি একটি Server Component (async)
export default async function ManageCustomersPage() {
  console.log("⚡ [Server] Admin Customers Page rendering started...");

  try {
    // ১. ডাটাবেস কানেক্ট করুন
    await dbConnect();
    console.log("✅ [Server] DB Connected.");

    // ২. সরাসরি সার্ভিস থেকে ডাটা আনুন
    console.log("🔍 [Server] Calling UserService.getAllCustomersWithStats()...");
    const customers = await UserService.getAllCustomersWithStats();
    
    console.log(`📊 [Server] Customers found: ${customers.length}`);
    if (customers.length > 0) {
        console.log("📄 [Server] Sample Data (First Customer):", JSON.stringify(customers[0], null, 2));
    } else {
        console.warn("⚠️ [Server] No customers returned from aggregation. Check 'users' role or 'orders' collection name.");
    }

    // ৩. ডাটা সিরিয়ালাইজ করুন
    const plainCustomers = JSON.parse(JSON.stringify(customers));

    // ৪. ক্লায়েন্ট কম্পোনেন্টে ডাটা পাস করুন
    return (
      <div className="p-6">
        <CustomerListClient initialCustomers={plainCustomers} />
      </div>
    );

  } catch (error) {
    console.error("🔥 [Server] Error loading customers:", error);
    return (
        <div className="p-10 text-center text-red-500">
            <h2 className="text-xl font-bold">Error Loading Data</h2>
            <p>Check your server terminal for details.</p>
        </div>
    );
  }
}