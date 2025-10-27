// app/api/products/[id]/route.ts
import { NextRequest } from 'next/server';
import {
  getSingleProductController,
  updateProductController,
  deleteProductController,
} from '@/modules/product/product.controller';
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
  authGuard('admin')(
    async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
      await dbConnect();
      return updateProductController(req, { params });
    }
  )
);


const deleteHandler = catchAsync(
  authGuard('admin')(
    async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
      await dbConnect();
      return deleteProductController(req, { params });
    }
  )
);

export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE };