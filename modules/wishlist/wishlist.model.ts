import { Schema, model, models, Types } from 'mongoose';

const wishlistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

const Wishlist = models.Wishlist || model('Wishlist', wishlistSchema);
export default Wishlist;