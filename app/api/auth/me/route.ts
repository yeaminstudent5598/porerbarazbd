// app/api/auth/me/route.ts
import dbConnect from '@/app/lib/dbConnect';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';
import { getMeController } from '@/modules/user/user.controller';

// GET /api/auth/me
const getHandler = catchAsync(
  authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return getMeController(req);
  })
);

export { getHandler as GET };