import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { authGuard } from '@/middlewares/auth.middleware';
import { getAllCustomersController } from '@/modules/user/user.controller';

export const GET = catchAsync(
  authGuard('admin')(async (req) => {
    await dbConnect();
    return getAllCustomersController(req);
  })
);