// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import { loginUserController } from '@/modules/user/user.controller';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';

// POST /api/auth/login
const postHandler = catchAsync(async (req: NextRequest) => {
  await dbConnect();
  return loginUserController(req);
});

export { postHandler as POST };