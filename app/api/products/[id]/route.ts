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
import AppError from '@/app/lib/utils/AppError';
import { ProductService } from '@/modules/product/product.service';
import sendResponse from '@/app/lib/sendResponse';


const getHandler = catchAsync(
  authGuard('admin')( // <-- অ্যাডমিন কিনা চেক করুন
    async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
      await dbConnect();
      
      const { id } = params;
      
      // === অ্যাডমিন সার্ভিস কল করুন (যেকোনো স্ট্যাটাসের প্রোডাক্ট আনবে) ===
      const product = await ProductService.getAdminProductByIdFromDB(id);

      if (!product) {
        throw new AppError(404, 'Product not found with this ID');
      }

      return sendResponse(
        200,
        'Admin: Product retrieved successfully',
        product
      );
    }
  )
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