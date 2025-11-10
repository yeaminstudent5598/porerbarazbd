// app/api/products/[id]/route.ts
import { NextRequest } from 'next/server';
import {
  getSingleProductController,
  updateProductController, // <-- এই কন্ট্রোলারটি এখন FormData হ্যান্ডেল করে
  deleteProductController,
} from '@/modules/product/product.controller'; // পাথ ঠিক করুন
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';


const getHandler = catchAsync(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    return getSingleProductController(req, { params });
  }
);


const putHandler = catchAsync(
  authGuard('admin')( // অ্যাডমিন কিনা চেক করুন
    async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
      await dbConnect();
      // আপডেট কন্ট্রোলার কল করুন
      return updateProductController(req, { params });
    }
  )
);


const deleteHandler = catchAsync(
  authGuard('admin')( // অ্যাডমিন কিনা চেক করুন
    async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
      await dbConnect();
      return deleteProductController(req, { params });
    }
  )
);

export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE };