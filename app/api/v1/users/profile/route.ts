import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { getMeController, updateMeController } from '@/modules/user/user.controller';

// GET: লগইন করা ইউজারের প্রোফাইল তথ্য আনবে
export const GET = catchAsync(
  authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return getMeController(req);
  })
);

// PUT: প্রোফাইল আপডেট করবে
export const PUT = catchAsync(
  authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return updateMeController(req);
  })
);