import { NextRequest } from 'next/server';
import { OrderService } from './order.service';
import { OrderValidation } from './order.validation';
import sendResponse from '@/app/lib/sendResponse';
import AppError from '@/app/lib/utils/AppError';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { verifyJwtToken } from '@/app/lib/jwt';

// POST /api/orders (Public/Protected - Create Order)
export const createOrderController = async (req: NextRequest) => {
  const body = await req.json();
  
  // ১. ভ্যালিডেশন
  const validationResult = OrderValidation.createOrderSchema.safeParse(body);
  if (!validationResult.success) throw validationResult.error;

  // ২. ইউজার চেক করা (Token ভেরিফাই)
  let userId = null;
  const authHeader = req.headers.get('authorization');
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        // টোকেন ডিকোড করে userId নেওয়া হচ্ছে
        const decoded = verifyJwtToken(token) as { userId: string, role: string } | null;
        if (decoded) {
          userId = decoded.userId;
        }
      } catch (err) {
        // টোকেন ইনভ্যালিড হলেও অর্ডার আটকাবো না, গেস্ট হিসেবে কাউন্ট হবে
        console.log("Invalid token during order creation, proceeding as guest.");
      }
    }
  }

  // ৩. অর্ডার ডাটা তৈরি করা
  const orderData = {
    ...validationResult.data,
    user: userId, // এখানে এখন userId বসবে যদি লগইন করা থাকে
  };

  // ৪. সার্ভিস কল
  const newOrder = await OrderService.createOrderInDB(orderData);
  return sendResponse(201, 'Order placed successfully!', newOrder);
};

// GET /api/orders (Admin Only - List)
export const getAllOrdersController = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());
  
  const result = await OrderService.getAllOrdersFromDB(query);
  
  return sendResponse(200, 'Orders retrieved successfully', result.data, result.meta);
};

// GET /api/orders/[id] (Admin/User - Details)
export const getSingleOrderController = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const order = await OrderService.getOrderByIdFromDB(id);
  if (!order) throw new AppError(404, 'Order not found');
  
  return sendResponse(200, 'Order details retrieved', order);
};

// PATCH /api/orders/[id] (Admin Only - Update Status)
export const updateOrderStatusController = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  
  const validationResult = OrderValidation.updateStatusSchema.safeParse(body);
  if (!validationResult.success) throw validationResult.error;

  const updatedOrder = await OrderService.updateOrderStatusInDB(id, validationResult.data.status);
  if (!updatedOrder) throw new AppError(404, 'Order not found to update');

  return sendResponse(200, 'Order status updated', updatedOrder);
};

// DELETE /api/orders/[id] (Admin Only)
export const deleteOrderController = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await OrderService.deleteOrderFromDB(id);
    return sendResponse(200, "Order deleted successfully", null);
}