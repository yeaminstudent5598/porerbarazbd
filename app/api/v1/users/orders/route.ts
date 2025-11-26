import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import Order from '@/modules/order/order.model';
import sendResponse from '@/app/lib/sendResponse';

// GET: লগইন করা ইউজারের অর্ডারগুলো আনবে
export const GET = catchAsync(
  authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    
    const userId = req.user.userId;

    // ডাটাবেস থেকে ইউজারের অর্ডার খোঁজা হচ্ছে
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 }) // লেটেস্ট অর্ডার সবার আগে
      .populate({
         path: 'items.product',
         select: 'name imageUrl' // প্রোডাক্টের নাম ও ছবি পপুলেট করা
      });

    return sendResponse(200, 'User orders retrieved successfully', orders);
  })
);