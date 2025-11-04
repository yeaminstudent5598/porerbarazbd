// D:\yeamin student\PorerBazarBD Project\porerbazarbd-nextjs\middlewares\auth.middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/modules/user/user.service';
import AppError from '@/app/lib/utils/AppError';
// import { verifyToken } from '@/app/lib/authUtils'; // <-- ১. এই লাইনটি ডিলিট করুন
import { verifyJwtToken } from '@/app/lib/jwt'; // <-- ২. এই লাইনটি যোগ করুন

type Role = 'user' | 'admin';

// ... (AuthenticatedRequest interface অপরিবর্তিত)
export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    role: Role;
  };
}

type AuthMiddleware = (
  handler: (req: AuthenticatedRequest, params: any) => Promise<NextResponse>
) => (req: NextRequest, params: any) => Promise<NextResponse>;

export const authGuard = (...allowedRoles: Role[]): AuthMiddleware => {
  return (handler) => {
    return async (req, params) => {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        throw new AppError(401, 'Authentication failed. No token provided.');
      }

      // const decoded = verifyToken(token); // <-- ৩. এই লাইনটি ডিলিট করুন
      
      // <-- ৪. এই লাইনটি যোগ করুন (এবং টাইপ দিন)
      const decoded = verifyJwtToken(token) as { userId: string; role: string } | null;

      // ✅ null চেক করা হয়েছে
      if (!decoded) {
        throw new AppError(401, 'Invalid or expired token.');
      }

      // ... (বাকি কোড অপরিবর্তিত)
      const user = await UserService.findUserById(decoded.userId);
      if (!user) {
        throw new AppError(404, 'User associated with this token no longer exists.');
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        throw new AppError(403, 'Forbidden. You do not have permission.');
      }

      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = {
        userId: user._id as string,
        role: user.role,
      };

      return handler(authenticatedReq, params);
    };
  };
};