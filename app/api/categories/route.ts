// app/api/categories/route.ts
import { NextRequest } from 'next/server';
import {
  getAllCategoriesController,
  createCategoryController,
} from '@/modules/category/category.controller';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';


const getHandler = catchAsync(async (req: NextRequest) => {
  await dbConnect();
  return getAllCategoriesController(req);
});


const postHandler = catchAsync(
  authGuard('admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return createCategoryController(req);
  })
);

export { getHandler as GET, postHandler as POST };