// modules/user/user.controller.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserValidation } from './user.validation';
import { UserService } from './user.service';
import AppError from '@/app/lib/utils/AppError';
import { createToken } from '@/app/lib/authUtils';
import config from '@/app/lib/config';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

// Controller for POST /api/auth/register
export const registerUserController = async (req: NextRequest) => {
  const body = await req.json();

  // 1. Validate data
  const validationResult = UserValidation.registerUserSchema.safeParse(body);
  if (!validationResult.success) {
    // AppError-এর 3য় আর্গুমেন্ট বাদ দেওয়া হয়েছে (বা AppError ক্লাস আপডেট করতে হবে)
    throw new AppError(400, 'Validation Failed'); 
    // অথবা: return NextResponse.json({ errors: validationResult.error.flatten() }, { status: 400 });
  }

  // 2. Call service to create user
  const newUser = await UserService.createUserInDB(validationResult.data);

  // 3. Send response
  return NextResponse.json(
    {
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: newUser, // User data (password already excluded by service/model)
    },
    { status: 201 }
  );
};

// Controller for POST /api/auth/login
export const loginUserController = async (req: NextRequest) => {
  const body = await req.json();

  // 1. Validate data
  const validationResult = UserValidation.loginUserSchema.safeParse(body);
  if (!validationResult.success) {
    throw new AppError(400, 'Validation Failed');
  }

  const { email, password } = validationResult.data;

  // 2. Find user by email
  const user = await UserService.findUserByEmailWithPassword(email);
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  // 3. Compare password (IUser-এ মেথডটি ডিফাইন করা আছে)
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new AppError(401, 'Invalid email or password');
  }

  // 4. Create JWT token
  const jwtPayload = {
    userId: user._id as string,
    role: user.role,
  };
  // createToken এখন 3টি আর্গুমেন্ট গ্রহণ করে (payload, secret, expiry)
  const accessToken = createToken(
    jwtPayload, 
    config.jwt.access_secret, 
    config.jwt.access_expires_in
  ); 

  // 5. Send response
  // user.toJSON() ব্যবহার করা হয়েছে পাসওয়ার্ড বাদ দেওয়ার জন্য
  const userResponseData = user.toJSON(); 
  
  return NextResponse.json(
    {
      success: true,
      statusCode: 200,
      message: 'User logged in successfully',
      data: {
        user: userResponseData,
        token: accessToken,
      },
    },
    { status: 200 }
  );
};

// Controller for GET /api/auth/me OR /api/users/profile
export const getMeController = async (req: AuthenticatedRequest) => {
    const userId = req.user.userId;
    
    const user = await UserService.findUserById(userId);

    if (!user) {
         throw new AppError(404, 'User not found');
    }
    
    return NextResponse.json(
        {
            success: true,
            statusCode: 200,
            message: 'User profile retrieved successfully',
            data: user, // Password এমনিতেই বাদ যাবে
        },
        { status: 200 }
    );
}

// Controller for PUT /api/users/profile
export const updateMeController = async (req: AuthenticatedRequest) => {
    const userId = req.user.userId;
    const body = await req.json();
    
    // 1. Validate data
    const validationResult = UserValidation.updateUserSchema.safeParse(body);
     if (!validationResult.success) {
        throw new AppError(400, 'Validation Failed');
     }
     
    // 2. Call service to update user
    const updatedUser = await UserService.updateUserProfileInDB(userId, validationResult.data);
    
    return NextResponse.json(
        {
            success: true,
            statusCode: 200,
            message: 'Profile updated successfully',
            data: updatedUser, // Password এমনিতেই বাদ যাবে
        },
        { status: 200 }
    );
}