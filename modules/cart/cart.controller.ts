import { NextRequest } from 'next/server';
import { CartService } from './cart.service';
import sendResponse from '@/app/lib/sendResponse';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

export const getCartController = async (req: AuthenticatedRequest) => {
  const result = await CartService.getMyCart(req.user.userId);
  return sendResponse(200, 'Cart retrieved', result);
};

export const addToCartController = async (req: AuthenticatedRequest) => {
  const { productId, quantity } = await req.json();
  const result = await CartService.addToCart(req.user.userId, productId, quantity || 1);
  return sendResponse(200, 'Item added to cart', result);
};

export const removeFromCartController = async (req: AuthenticatedRequest) => {
  const { productId } = await req.json(); // Body থেকে productId নিবে
  const result = await CartService.removeFromCart(req.user.userId, productId);
  return sendResponse(200, 'Item removed from cart', result);
};

export const updateCartQuantityController = async (req: AuthenticatedRequest) => {
    const { productId, type } = await req.json();
    const result = await CartService.updateQuantity(req.user.userId, productId, type);
    return sendResponse(200, 'Cart updated', result);
}