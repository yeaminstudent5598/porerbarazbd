import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import { addToCartController, getCartController, removeFromCartController, updateCartQuantityController } from '@/modules/cart/cart.controller';

// GET: Get my cart
export const GET = catchAsync(
  authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return getCartController(req);
  })
);

// POST: Add to cart
export const POST = catchAsync(
  authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return addToCartController(req);
  })
);

// DELETE: Remove item
export const DELETE = catchAsync(
    authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
      await dbConnect();
      return removeFromCartController(req);
    })
);

// PATCH: Update Quantity
export const PATCH = catchAsync(
    authGuard('user', 'admin')(async (req: AuthenticatedRequest) => {
        await dbConnect();
        return updateCartQuantityController(req);
    })
)