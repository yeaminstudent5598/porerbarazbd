// app/api/products/route.ts
import { NextRequest } from 'next/server';
import {
  getAllProductsController,
  createProductController,
} from '@/modules/product/product.controller';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';


const getHandler = catchAsync(async (req: NextRequest) => {
  await dbConnect();
  return getAllProductsController(req);
});

const postHandler = catchAsync(
  authGuard('admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return createProductController(req);
  })
);

export { getHandler as GET, postHandler as POST };