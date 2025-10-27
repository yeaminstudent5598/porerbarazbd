// modules/product/product.model.ts
import { Schema, model, models } from 'mongoose';
import { IProduct, IProductModel } from './product.interface';

const productSchema = new Schema<IProduct, IProductModel>(
  {
    name: { 
      type: String, 
      required: [true, 'Product name is required'],
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, 'Product description is required'] 
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    oldPrice: { 
      type: Number,
      min: [0, 'Old price cannot be negative']
    },
    stock: { 
      type: Number, 
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    category: { 
      type: String, 
      required: [true, 'Category is required'],
      trim: true
    },
    imageUrl: { 
      type: String, 
      required: [true, 'Image URL is required'] 
    },
    imagePublicId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Out of Stock'],
      default: 'Active'
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    weight: { type: String },
    ingredients: [ { type: String } ]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret: any) { // <-- ret-কে any টাইপ দিন
        delete ret.__v; // <-- এখন এটি এরর দেবে না
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret: any) { // <-- ret-কে any টাইপ দিন
        delete ret.__v; // <-- এখন এটি এরর দেবে না
        return ret;
      },
    }
  }
);

productSchema.pre('save', function (next) {
  if (this.isModified('stock') && this.stock === 0) {
    this.status = 'Out of Stock';
  } else if (this.isModified('stock') && this.stock > 0 && this.status === 'Out of Stock') {
    this.status = 'Active';
  }
  next();
});

const Product = models.Product || model<IProduct, IProductModel>('Product', productSchema);

export default Product;