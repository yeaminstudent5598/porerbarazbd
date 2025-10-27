// app/api/categories/[id]/route.ts
// [id] ফোল্ডারটি ID বা Slug দুটোই হ্যান্ডেল করবে
import { NextRequest } from 'next/server';
import {
  getSingleCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '@/modules/category/category.controller';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';


const getHandler = catchAsync(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    return getSingleCategoryController(req, { params });
  }
);


const putHandler = catchAsync(
  authGuard('admin')(
    async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
      await dbConnect();
      return updateCategoryController(req, { params });
    }
  )
);


const deleteHandler = catchAsync(
  authGuard('admin')(
    async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
      await dbConnect();
      return deleteCategoryController(req, { params });
    }
  )
);

export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE };