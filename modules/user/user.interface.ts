// modules/user/user.interface.ts
import { Model, Document } from 'mongoose';

// Interface for User properties
export interface IUser extends Document { // <-- Document এক্সটেন্ড করা হয়েছে
//   _id?: string;
  name: string;
  email: string;
  password: string; // Will be selected: false in model
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;

  // Instance method for comparing password
  comparePassword(candidatePassword: string): Promise<boolean>;
  
}

// Interface for Mongoose Model (for static methods, if any)
export interface IUserModel extends Model<IUser> {
  isUserExists(email: string): Promise<IUser | null>;
}