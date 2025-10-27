// modules/user/user.service.ts
import User from './user.model';
import { IUser } from './user.interface';
import AppError from '@/app/lib/utils/AppError';

// Input type for creating user
export type TCreateUser = {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
};

// Create user in DB
const createUserInDB = async (data: TCreateUser): Promise<IUser> => {
  const user = await User.create(data);
  return user;
};

// Find user by email (for login)
const findUserByEmailWithPassword = async (
  email: string
): Promise<IUser | null> => {
  const user = await User.findOne({ email }).select('+password');
  return user;
};

// Find user by ID (for auth checks / getMe)
const findUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id); // password not selected
  return user;
};

// Update user profile
const updateUserProfileInDB = async (
  userId: string,
  updateData: Partial<Pick<IUser, 'name' /* | other fields */>>
): Promise<IUser | null> => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
};

export const UserService = {
  createUserInDB,
  findUserByEmailWithPassword,
  findUserById,
  updateUserProfileInDB,
};
