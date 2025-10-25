// modules/user/user.validation.ts
import { z } from 'zod';

// Zod schema for registration
const registerUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['user', 'admin']).optional(), // Role is optional, defaults to 'user'
});

// Zod schema for login
const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Zod schema for profile update
const updateUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long').optional(),
  // Add other updatable fields like phone
  // phone: z.string().optional(),
});

export const UserValidation = {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
};