import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import AppError from './AppError';

type RouteHandler<TParams extends Record<string, any> = any> = (
  req: NextRequest,
  context: { params: TParams }
) => Promise<NextResponse>;

export const catchAsync = <TParams extends Record<string, any> = any>(
  fn: RouteHandler<TParams>
) => {
  return async (
    req: NextRequest,
    context: { params: TParams }
  ) => {
    try {
      return await fn(req, context);
    } catch (error: any) {
      console.error('💥 UNHANDLED ERROR in catchAsync 💥', error);

      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation Failed',
            errors: error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }

      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { success: false, message: 'Validation Error', errors: error.errors },
          { status: 400 }
        );
      }

      if (error.code === 11000) {
        return NextResponse.json(
          { success: false, message: `Duplicate field value entered: ${Object.keys(error.keyValue).join(', ')}` },
          { status: 409 }
        );
      }

      if (error.name === 'CastError') {
        return NextResponse.json(
          { success: false, message: `Invalid resource ID: ${error.value}` },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: 'Something went very wrong!', errorDetails: error.message },
        { status: 500 }
      );
    }
  };
};
