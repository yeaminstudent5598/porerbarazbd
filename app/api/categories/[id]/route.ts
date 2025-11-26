import { NextRequest } from 'next/server';
import {
  getSingleCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '@/modules/category/category.controller';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';

// Next.js 15: Params is a Promise
type Props = {
  params: Promise<{ id: string }>;
};

// GET
const getHandler = catchAsync(
  async (req: NextRequest, props: Props) => {
    await dbConnect();
    const params = await props.params; // ✅ Await params
    return getSingleCategoryController(req, { params });
  }
);

// PUT (Admin)
const putHandler = catchAsync(
  authGuard('admin')(
    async (req: AuthenticatedRequest, props: Props) => {
      await dbConnect();
      const params = await props.params; // ✅ Await params
      return updateCategoryController(req, { params });
    }
  )
);

// DELETE (Admin)
const deleteHandler = catchAsync(
  authGuard('admin')(
    async (req: AuthenticatedRequest, props: Props) => {
      await dbConnect();
      const params = await props.params; // ✅ Await params
      return deleteCategoryController(req, { params });
    }
  )
);

export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE };