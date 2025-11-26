import {
  getSingleOrderController,
  updateOrderStatusController,
  deleteOrderController
} from '@/modules/order/order.controller';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { authGuard } from '@/middlewares/auth.middleware';

type Props = { params: Promise<{ id: string }> };

// GET Single Order (Admin or User can see details if they have ID)
// আপনি চাইলে এখানেও authGuard লাগাতে পারেন, তবে আপাতত ওপেন রাখছি ডিবাগিং এর জন্য
export const GET = catchAsync(async (req, props: Props) => {
  await dbConnect();
  return getSingleOrderController(req, props);
});

// PATCH Update Status (Admin Only)
export const PATCH = catchAsync(
  authGuard('admin')(async (req, props: Props) => {
    await dbConnect();
    return updateOrderStatusController(req, props);
  })
);

// DELETE Order (Admin Only)
export const DELETE = catchAsync(
    authGuard('admin')(async (req, props: Props) => {
        await dbConnect();
        return deleteOrderController(req, props);
    })
);