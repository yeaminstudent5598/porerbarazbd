// modules/user/user.service.ts
import User from './user.model';
import { IUser } from './user.interface';
import AppError from '@/app/lib/utils/AppError';

// Create new user in DB
const createUserInDB = async (
  userData: Omit<IUser, 'role'> & { role?: 'user' | 'admin' }
): Promise<IUser> => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(409, 'User with this email already exists');
  }

  const newUser = await User.create(userData);
  
  // Refetch to apply toJSON transform
  const result = await User.findById(newUser._id);
  if (!result) throw new AppError(500, 'Failed to create user'); // Should not happen
  
  return result.toJSON() as IUser; // toJSON() পাসওয়ার্ড বাদ দিয়ে দেবে
};

// Find user by email (for login)
const findUserByEmailWithPassword = async (
  email: string
): Promise<IUser | null> => {
  // findOne() Mongoose Document (যা IUser এক্সটেন্ড করে) অথবা null রিটার্ন করে
  const user: IUser | null = await User.findOne({ email }).select('+password');
  return user;
};

// Find user by ID (for auth checks / getMe)
const findUserById = async (
  id: string
): Promise<IUser | null> => {
  const user: IUser | null = await User.findById(id); // Password not selected
  return user;
};

// Update user profile
const updateUserProfileInDB = async (
  userId: string,
  updateData: Partial<Pick<IUser, 'name' /* | 'phone' etc */>>
): Promise<IUser | null> => {
  const updatedUser: IUser | null = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  return updatedUser;
};

export const UserService = {
  createUserInDB,
  findUserByEmailWithPassword,
  findUserById,
  updateUserProfileInDB,
};