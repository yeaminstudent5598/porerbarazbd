// modules/user/user.controller.ts
import { NextRequest } from 'next/server';
import { UserService, TCreateUser } from './user.service';
import { UserValidation } from './user.validation';
import AppError from '@/app/lib/utils/AppError';
import sendResponse from '@/app/lib/sendResponse';
import { createToken } from '@/app/lib/authUtils';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

// POST /api/auth/register
export const registerUserController = async (req: NextRequest) => {
  const body = await req.json();

  const validationResult = UserValidation.registerUserSchema.safeParse(body);
  if (!validationResult.success) throw validationResult.error;

  const newUser = await UserService.createUserInDB(validationResult.data as TCreateUser);

  return sendResponse(201, 'User registered successfully', newUser);
};

// POST /api/auth/login
export const loginUserController = async (req: NextRequest) => {
  const body = await req.json();

  const validationResult = UserValidation.loginUserSchema.safeParse(body);
  if (!validationResult.success) throw validationResult.error;

  const { email, password } = validationResult.data;
  const user = await UserService.findUserByEmailWithPassword(email);
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(401, 'Invalid email or password');
  }

  const jwtPayload = { userId: user._id.toString(), role: user.role };
  const accessToken = createToken(jwtPayload);

  return sendResponse(200, 'User logged in successfully', {
    user: user.toJSON(),
    token: accessToken,
  });
};

// GET /api/users/profile
export const getMeController = async (req: AuthenticatedRequest) => {
  const userId = req.user.userId;
  const user = await UserService.findUserById(userId);
  if (!user) throw new AppError(404, 'User not found');

  return sendResponse(200, 'User profile retrieved successfully', user);
};

// PUT /api/users/profile
export const updateMeController = async (req: AuthenticatedRequest) => {
  const userId = req.user.userId;
  const body = await req.json();

  const validationResult = UserValidation.updateUserSchema.safeParse(body);
  if (!validationResult.success) throw validationResult.error;

  const updatedUser = await UserService.updateUserProfileInDB(
    userId,
    validationResult.data
  );

  return sendResponse(200, 'Profile updated successfully', updatedUser);
};
