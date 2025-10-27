// modules/category/category.validation.ts
import { z } from 'zod';

const categoryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string()
    .min(2)
    .optional()
    .or(z.literal(''))
    .transform(val => val ? val.toLowerCase().replace(/ /g, '-') : undefined),
});

const updateCategoryFormSchema = categoryFormSchema.partial();

export const CategoryValidation = {
  categoryFormSchema,
  updateCategoryFormSchema,
};
