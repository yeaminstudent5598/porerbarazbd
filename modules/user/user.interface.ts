// modules/user/user.interface.ts
import { Document, Model } from 'mongoose';

// Interface for User properties
export interface IUser extends Document {
  _id: string; // Explicitly declare _id as string
  name: string;
  email: string;
  password: string; // will be selected false by default in model
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;

  // Instance method for comparing password
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for Mongoose Model (for static methods)
export interface IUserModel extends Model<IUser> {
  // Optional: example static method to check if user exists
  isUserExists(email: string): Promise<IUser | null>;
}
