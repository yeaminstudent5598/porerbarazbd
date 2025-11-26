import { z } from 'zod';

const createOrderSchema = z.object({
  customerInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(11),
    address: z.string().min(5),
    city: z.string(),
    zip: z.string().optional(),
  }),
  items: z.array(
    z.object({
      product: z.string(), // Product ID
      name: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
      image: z.string().optional(),
    })
  ).min(1, "Cart cannot be empty"),
  totalAmount: z.number(),
  shippingCost: z.number().optional(),
  paymentMethod: z.enum(['COD', 'Online']).default('COD'),
  notes: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
});

export const OrderValidation = {
  createOrderSchema,
  updateStatusSchema,
};