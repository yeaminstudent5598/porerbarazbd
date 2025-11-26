import { AuthenticatedRequest, authGuard } from '@/middlewares/auth.middleware';
import { catchAsync } from '@/app/lib/utils/catchAsync';
import dbConnect from '@/app/lib/dbConnect';
import Wishlist from '@/modules/wishlist/wishlist.model';
import sendResponse from '@/app/lib/sendResponse';
import { Types } from 'mongoose';

export const POST = catchAsync(authGuard('user', 'admin')(async (req) => {
    await dbConnect();
    const { productId } = await req.json();
    const userId = req.user.userId;

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });

    const exists = wishlist.products.includes(productId);
    if (exists) {
        wishlist.products = wishlist.products.filter((id: Types.ObjectId) => id.toString() !== productId);
    } else {
        wishlist.products.push(productId);
    }
    await wishlist.save();
    
    return sendResponse(200, exists ? 'Removed from wishlist' : 'Added to wishlist', wishlist);
}));

export const GET = catchAsync(authGuard('user', 'admin')(async (req) => {
    await dbConnect();
    const wishlist = await Wishlist.findOne({ user: req.user.userId }).populate('products');
    return sendResponse(200, 'Wishlist retrieved', wishlist || { products: [] });
}));