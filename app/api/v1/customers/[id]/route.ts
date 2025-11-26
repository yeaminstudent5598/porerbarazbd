import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { authGuard } from '@/middlewares/auth.middleware';
import { getCustomerDetailsController } from '@/modules/user/user.controller';

type Props = { params: Promise<{ id: string }> };

export const GET = catchAsync(
  authGuard('admin')(async (req, props: Props) => {
    await dbConnect();
    return getCustomerDetailsController(req, props);
  })
);