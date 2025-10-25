// app/api/users/profile/route.ts
import dbConnect from '@/app/lib/dbConnect';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';
import { getMeController, updateMeController } from '@/modules/user/user.controller';

// GET /api/users/profile
const getHandler = catchAsync(
  authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return getMeController(req);
  })
);

// PUT /api/users/profile
const putHandler = catchAsync(
  authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return updateMeController(req);
  })
);

export { getHandler as GET, putHandler as PUT };