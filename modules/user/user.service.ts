// modules/user/user.service.ts
import User from './user.model';
import { IUser } from './user.interface';
import AppError from '@/app/lib/utils/AppError';
import Order from '../order/order.model';
import mongoose from 'mongoose';

// Input type for creating user
export type TCreateUser = {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
};

// Create user in DB
const createUserInDB = async (data: TCreateUser): Promise<IUser> => {
  const user = await User.create(data);
  return user;
};

// Find user by email (for login)
const findUserByEmailWithPassword = async (
  email: string
): Promise<IUser | null> => {
  const user = await User.findOne({ email }).select('+password');
  return user;
};

// Find user by ID (for auth checks / getMe)
const findUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id); // password not selected
  return user;
};

// Update user profile
const updateUserProfileInDB = async (
  userId: string,
  updateData: Partial<Pick<IUser, 'name' /* | other fields */>>
): Promise<IUser | null> => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
};

// ১. সব কাস্টমার এবং তাদের অর্ডারের সামারি (Admin)
const getAllCustomersWithStats = async () => {
  // 🔍 DEBUG: প্রথমে চেক করি ডাটাবেসে আদৌ কোনো ইউজার আছে কিনা
  const totalUsers = await User.countDocuments({});
  console.log(`🔍 [Service] Total users in DB: ${totalUsers}`);

  // Mongoose নিশ্চিত করছে যে 'Order' মডেলটি রেজিস্টার করা আছে
  if (!mongoose.models.Order) {
      console.log("⚠️ [Service] Order model not loaded, loading now...");
      // Order মডেল ইনিশিয়ালাইজ করার জন্য জাস্ট ইম্পোর্ট স্টেটমেন্ট যথেষ্ট
  }

  const customers = await User.aggregate([
    // ❌ আগের ফিল্টার ছিল: { $match: { role: { $ne: 'admin' } } }, 
    // ✅ ডিবাগিং এর জন্য ফিল্টার সরিয়ে দেওয়া হলো। এখন অ্যাডমিনসহ সবাইকে দেখাবে।
    // পরে আপনি চাইলে আবার ফিল্টার চালু করতে পারেন।
    
    {
      $lookup: {
        from: 'orders', // ডাটাবেসে কালেকশনের নাম 'orders' (lowercase & plural)
        localField: '_id',
        foreignField: 'user',
        as: 'orderData',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        role: 1, // রোল দেখার জন্য যোগ করা হলো
        phone: 1, 
        avatar: 1, 
        createdAt: 1, 
        totalOrders: { $size: '$orderData' }, // মোট অর্ডার সংখ্যা
        totalSpent: { $sum: '$orderData.totalAmount' }, // মোট খরচ
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  console.log(`✅ [Service] Aggregation result count: ${customers.length}`);
  return customers;
};

// ২. নির্দিষ্ট কাস্টমারের ডিটেইলস এবং অর্ডার হিস্ট্রি
const getCustomerDetailsById = async (id: string) => {
  const user = await User.findById(id).select('-password').lean();
  if (!user) return null;

  // এই ইউজারের সব অর্ডার খুঁজে বের করা
  const orders = await Order.find({ user: id }).sort({ createdAt: -1 }).lean();
  
  // মোট খরচ হিসাব করা
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return { 
    ...user, 
    orders, 
    totalSpent, 
    totalOrders: orders.length 
  };
};

export const UserService = {
  createUserInDB,
  findUserByEmailWithPassword,
  findUserById,
  updateUserProfileInDB,
  getAllCustomersWithStats,
  getCustomerDetailsById,
};
