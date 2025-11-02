// modules/category/category.model.ts
import { Schema, model, models } from 'mongoose';
import { ICategory, ICategoryModel } from './category.interface';
import AppError from '@/app/lib/utils/AppError';

const categorySchema = new Schema<ICategory, ICategoryModel>(
  {
    name: { 
      type: String, 
      required: [true, 'Category name is required'], 
      unique: true, 
      trim: true 
    },
    slug: { 
      type: String, 
      unique: true, 
      trim: true 
    },
    imageUrl: { 
      type: String, 
      required: [true, 'Image URL is required'] 
    },
    imagePublicId: { 
      type: String, 
      required: [true, 'Image Public ID is required'] 
    },
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

// Mongoose Middleware: সেভ করার আগে slug তৈরি করা
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ & /g, '-')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

// Mongoose Middleware: আপডেট করার আগে slug তৈরি করা
categorySchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as Partial<ICategory>;
    
    if (update && update.name) { // 'update' null নয় তা চেক করুন
        update.slug = update.name
            .toLowerCase()
            .replace(/ & /g, '-')
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
            
        // নিশ্চিত করুন নতুন slug ইউনিক
        // @ts-ignore
        const existing = await this.constructor.findOne({ slug: update.slug });
        // @ts-ignore
        if (existing && existing._id.toString() !== this.getQuery()._id.toString()) {
             return next(new AppError(409, 'Category slug must be unique.'));
        }
        
        this.setUpdate(update);
    }
    
    next();
});


const Category = models.Category || model<ICategory, ICategoryModel>('Category', categorySchema);

export default Category;