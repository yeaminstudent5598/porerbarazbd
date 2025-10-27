// modules/category/category.model.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = models.Category || model<ICategory>('Category', categorySchema);

export default Category;
