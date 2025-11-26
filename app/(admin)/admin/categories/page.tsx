// app/(admin)/categories/page.tsx (Server Component)
import React from 'react';
import CategoryClient from './CategoryClient';
import { CategoryService } from '@/modules/category/category.service'; // ডাইরেক্ট সার্ভিস কল

// Next.js এ সার্ভার কম্পোনেন্টে async ফাংশন ব্যবহার করা যায়
export default async function ManageCategoriesPage() {
  
  // ১. ডাইরেক্ট ডেটাবেস থেকে ডেটা আনা হচ্ছে (API কল করার দরকার নেই কারণ আমরা সার্ভারেই আছি)
  const categories = await CategoryService.getAllCategoriesFromDB();

  // ২. MongoDB অবজেক্টগুলোকে Plain JSON এ কনভার্ট করা (Warning এড়ানোর জন্য)
  const plainCategories = JSON.parse(JSON.stringify(categories));

  // ৩. ডেটা ক্লায়েন্ট কম্পোনেন্টে পাস করা
  return (
    <CategoryClient initialCategories={plainCategories} />
  );
}