// lib/utils/catchAsync.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import AppError from './AppError'; // আমরা একটি কাস্টম এরর ক্লাস তৈরি করবো

// Define the type for our handler function
type RouteHandler = (
  req: NextRequest,
  params: { [key: string]: string | string[] | undefined }
) => Promise<NextResponse>;

// Higher-order function to wrap our controllers
export const catchAsync = (fn: RouteHandler) => {
  return async (
    req: NextRequest,
    params: { [key: string]: string | string[] | undefined }
  ) => {
    try {
      // Execute the actual controller function
      return await fn(req, params);
    } catch (error: any) {
      console.error('💥 UNHANDLED ERROR 💥', error);

      // --- Handle Different Error Types ---

      // Zod Validation Error
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation Failed',
            errors: error.flatten().fieldErrors,
          },
          { status: 400 } // Bad Request
        );
      }
      
      // Custom App Error
      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }

      // Mongoose Validation Error
      if (error.name === 'ValidationError') {
         return NextResponse.json(
          { success: false, message: 'Validation Error', errors: error.errors },
          { status: 400 }
        );
      }

      // Mongoose Duplicate Key Error
      if (error.code === 11000) {
         return NextResponse.json(
          { success: false, message: `Duplicate field value entered: ${Object.keys(error.keyValue).join(', ')}` },
          { status: 409 } // Conflict
        );
      }
      
      // Mongoose Cast Error (Invalid ID)
      if (error.name === 'CastError') {
           return NextResponse.json(
            { success: false, message: `Invalid resource ID: ${error.value}` },
            { status: 400 }
        );
      }

      // Default Server Error
      return NextResponse.json(
        { success: false, message: 'Something went very wrong!' },
        { status: 500 }
      );
    }
  };
};