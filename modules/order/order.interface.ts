import { Document, Types } from 'mongoose';

export type TOrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type TPaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface IOrderItem {
  product: Types.ObjectId; // Reference to Product
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  user?: Types.ObjectId; // Optional if guest checkout is allowed
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip?: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  shippingCost: number;
  paymentMethod: 'COD' | 'Online'; 
  paymentStatus: TPaymentStatus;
  status: TOrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}