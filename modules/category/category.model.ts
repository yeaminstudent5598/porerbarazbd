// modules/category/category.model.ts
import { Schema, model, models } from 'mongoose';
import slugify from 'slugify'; // <-- পরিবর্তন ১: slugify ইম্পোর্ট করা হয়েছে
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
      transform: function (doc, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret: any) {
        delete ret.__v;
        return ret;
      },
    }
  }
);

// Mongoose Middleware: সেভ করার আগে slug তৈরি করা
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    // --- পরিবর্তন ২: ম্যানুয়াল Lreplace() এর বদলে slugify ব্যবহার ---
    this.slug = slugify(this.name, {
      lower: true,    // slug-কে lowercase করবে
      strict: true,   // বিশেষ ক্যারেক্টার বাদ দিবে
      trim: true
    });
    // --------------------------------------------------------
  }
  next();
});

// Mongoose Middleware: আপডেট করার আগে slug তৈরি করা
categorySchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as Partial<ICategory>;
    
    if (update && update.name) { 
      // --- পরিবর্তন ৩: ম্যানুয়াল Lreplace() এর বদলে slugify ব্যবহার ---
      update.slug = slugify(update.name, {
        lower: true,
        strict: true,
        trim: true
      });
      // --------------------------------------------------------
            
      // নিশ্চিত করুন নতুন slug ইউনিক (এই লজিকটি ঠিকই আছে)
      try {
        // @ts-ignore
        const existing = await this.constructor.findOne({ slug: update.slug });
        // @ts-ignore
        const queryId = this.getQuery()._id;

        if (existing && existing._id.toString() !== queryId.toString()) {
            return next(new AppError(409, `A category with slug '${update.slug}' already exists.`));
        }
        
        this.setUpdate(update);

      } catch (error: any) {
        return next(error);
      }
    }
    
    next();
});


const Category = models.Category || model<ICategory, ICategoryModel>('Category', categorySchema);

export default Category;