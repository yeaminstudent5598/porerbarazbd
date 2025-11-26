import { NextRequest } from 'next/server';
import {
  getSingleProductController,
  updateProductController,
  deleteProductController,
} from '@/modules/product/product.controller';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';

// Next.js 15: Params is a Promise
type Props = {
  params: Promise<{ id: string }>;
};

// ✅ GET: Public Access (No authGuard)
// আমরা props.params কে await করে আনবক্স করছি
const getHandler = catchAsync(
  async (req: NextRequest, props: Props) => {
    await dbConnect();
    const params = await props.params; 
    return getSingleProductController(req, { params });
  }
);

// ✅ PUT: Admin Only
const putHandler = catchAsync(
  authGuard('admin')(
    async (req: AuthenticatedRequest, props: Props) => {
      await dbConnect();
      const params = await props.params;
      return updateProductController(req, { params });
    }
  )
);

// ✅ DELETE: Admin Only
const deleteHandler = catchAsync(
  authGuard('admin')(
    async (req: AuthenticatedRequest, props: Props) => {
      await dbConnect();
      const params = await props.params;
      return deleteProductController(req, { params });
    }
  )
);

export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE };