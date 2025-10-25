// app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import { registerUserController } from '@/modules/user/user.controller';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';

// POST /api/auth/register
const postHandler = catchAsync(async (req: NextRequest) => {
  await dbConnect();
  
  return registerUserController(req);
});

export { postHandler as POST };