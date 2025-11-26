import { NextRequest } from 'next/server';
import { createOrderController, getAllOrdersController } from '@/modules/order/order.controller';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { authGuard } from '@/middlewares/auth.middleware';

// GET: Get All Orders (Admin Only)
export const GET = catchAsync(
  authGuard('admin')(async (req) => {
    await dbConnect();
    return getAllOrdersController(req);
  })
);

// POST: Create Order (Public)
export const POST = catchAsync(async (req: NextRequest) => {
    await dbConnect();
    return createOrderController(req);
});