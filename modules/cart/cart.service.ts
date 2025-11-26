import Cart from './cart.model';
import Product from '../product/product.model'; // প্রোডাক্ট প্রাইস চেক করার জন্য
import AppError from '@/app/lib/utils/AppError';

const getMyCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const addToCart = async (userId: string, productId: string, quantity: number) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError(404, 'Product not found');

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId);

  const price = product.newPrice || product.price; // ডিসকাউন্ট প্রাইস থাকলে সেটা নিবে

  if (existingItemIndex > -1) {
    // অলরেডি কার্টে থাকলে কোয়ান্টিটি বাড়াবে
    cart.items[existingItemIndex].quantity += quantity;
    cart.items[existingItemIndex].price = price; // প্রাইস আপডেট (যদি অ্যাডমিন প্রাইস চেঞ্জ করে)
  } else {
    // নতুন আইটেম
    cart.items.push({ product: productId, quantity, price });
  }

  await cart.save();
  return await getMyCart(userId); // পপুলেটেড কার্ট রিটার্ন করবে
};

const removeFromCart = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError(404, 'Cart not found');

  cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);
  await cart.save();
  return await getMyCart(userId);
};

const updateQuantity = async (userId: string, productId: string, type: 'increment' | 'decrement') => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new AppError(404, 'Cart not found');

    const itemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId);
    if (itemIndex === -1) throw new AppError(404, 'Product not in cart');

    if (type === 'increment') {
        cart.items[itemIndex].quantity += 1;
    } else {
        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            // ১ এর কম হলে রিমুভ করে দিবে
            cart.items.splice(itemIndex, 1);
        }
    }
    
    await cart.save();
    return await getMyCart(userId);
}

export const CartService = {
  getMyCart,
  addToCart,
  removeFromCart,
  updateQuantity
};