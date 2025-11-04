import { NextRequest } from "next/server";
import { getAllProductsController } from "@/modules/product/product.controller";
import dbConnect from "@/app/lib/dbConnect";
import { catchAsync } from "@/app/lib/utils/catchAsync";
import { authGuard } from "@/middlewares/auth.middleware";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";

const getHandler = catchAsync(
  authGuard('admin')(async (req: AuthenticatedRequest) => {
    await dbConnect();
    return getAllProductsController(req);
  })
);

export { getHandler as GET };
