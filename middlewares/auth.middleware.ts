import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/modules/user/user.service';
import AppError from '@/app/lib/utils/AppError';
import { verifyJwtToken } from '@/app/lib/jwt';
import dbConnect from '@/app/lib/dbConnect'; // ✅ ১. dbConnect ইম্পোর্ট করুন

type Role = 'user' | 'admin';

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
    return async (req: NextRequest, params: any) => {
      // ✅ ২. ফিক্স: মিডলওয়্যার লজিক শুরুর আগেই ডাটাবেস কানেক্ট করুন
      await dbConnect();

      const authHeader = req.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        throw new AppError(401, 'Authentication failed. No token provided.');
      }

      const decoded = verifyJwtToken(token) as { userId: string; role: string } | null;

      if (!decoded) {
        throw new AppError(401, 'Invalid or expired token.');
      }

      // ডাটাবেস কানেকশন থাকায় এখন আর টাইমআউট হবে না
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