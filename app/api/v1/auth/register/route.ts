// app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import { registerUserController } from '@/modules/user/user.controller'; // কন্ট্রোলার ইম্পোর্ট
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const postHandler = catchAsync(async (req: NextRequest) => {
  // প্রতিটি API কলে প্রথমে ডাটাবেস কানেকশন নিশ্চিত করুন
  await dbConnect();
  
  // কন্ট্রোলার ফাংশন কল করুন
  return registerUserController(req);
});

// Next.js App Router-এ POST মেথড হিসেবে এক্সপোর্ট করুন
export { postHandler as POST };