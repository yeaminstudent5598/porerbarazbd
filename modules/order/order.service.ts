import Order from './order.model';
import { IOrder, TOrderStatus } from './order.interface';
// ✅ FIX: Import Product model to ensure Schema is registered before populate works
import '@/modules/product/product.model'; 

// Create Order (COD)
const createOrderInDB = async (orderData: any): Promise<IOrder> => {
  // If COD, Payment Status is Pending by default
  const newOrder = await Order.create({
    ...orderData,
    paymentStatus: 'Pending',
  });
  return newOrder;
};

// Get All Orders (Admin)
const getAllOrdersFromDB = async (query: any) => {
  const { page = 1, limit = 10, searchTerm } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};
  if (searchTerm) {
    filter.$or = [
      { 'customerInfo.name': { $regex: searchTerm, $options: 'i' } },
      { 'customerInfo.phone': { $regex: searchTerm, $options: 'i' } },
      // Order ID search needs special handling if using ObjectId, so simplified here
    ];
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 }) // Latest first
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Order.countDocuments(filter);

  return { data: orders, meta: { page: Number(page), limit: Number(limit), total } };
};

// Get Single Order
const getOrderByIdFromDB = async (id: string): Promise<IOrder | null> => {
  // The error happened here because 'Product' wasn't known to Mongoose yet
  const order = await Order.findById(id).populate('items.product').lean();
  return order as IOrder;
};

// Update Order Status
const updateOrderStatusInDB = async (id: string, status: TOrderStatus): Promise<IOrder | null> => {
  const updatePayload: any = { status };
  
  // If marked Delivered, update payment status to Paid for COD
  if (status === 'Delivered') {
    updatePayload.paymentStatus = 'Paid';
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { $set: updatePayload },
    { new: true }
  );
  return updatedOrder;
};

// Delete Order
const deleteOrderFromDB = async (id: string) => {
    const result = await Order.findByIdAndDelete(id);
    return result;
}

export const OrderService = {
  createOrderInDB,
  getAllOrdersFromDB,
  getOrderByIdFromDB,
  updateOrderStatusInDB,
  deleteOrderFromDB
};