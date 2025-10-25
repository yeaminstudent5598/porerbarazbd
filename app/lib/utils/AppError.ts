// lib/utils/AppError.ts
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    // Mark as operational (trusted) error
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;