import { Document, Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number; // সেলিং প্রাইস (হিস্ট্রির জন্য)
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  totalItems: number;
}