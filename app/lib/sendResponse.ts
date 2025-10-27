// lib/utils/sendResponse.ts
import { NextResponse } from 'next/server';

// রেসপন্সের জন্য একটি স্ট্যান্ডার্ড টাইপ
type TApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null; // ডেটা (null হতে পারে)
  meta?: { // প্যাজিনেশনের জন্য (ঐচ্ছিক)
    page: number;
    limit: number;
    total: number;
  };
};

/**
 * API রেসপন্স পাঠানোর জন্য একটি হেল্পার ফাংশন
 * @param statusCode HTTP স্ট্যাটাস কোড (e.g., 200, 201, 404)
 * @param message রেসপন্সের বার্তা
 * @param data পাঠানোর ডেটা (বা null)
 * @param meta প্যাজিনেশন তথ্য (ঐচ্ছিক)
 * @returns NextResponse অবজেক্ট
 */
const sendResponse = <T>(
  statusCode: number,
  message: string,
  data: T | null,
  meta?: {
    page: number;
    limit: number;
    total: number;
  }
): NextResponse => {
  
  const responseData: TApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300, // 2xx স্ট্যাটাস কোড সফল বলে গণ্য হবে
    statusCode,
    message,
    data,
  };

  // যদি meta তথ্য থাকে, তা রেসপন্সে যোগ করুন
  if (meta) {
    responseData.meta = meta;
  }

  return NextResponse.json(responseData, { status: statusCode });
};

export default sendResponse;