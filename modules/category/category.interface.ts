// modules/category/category.interface.ts

export interface ICategory {
  _id: string;
  name: string;
  slug?: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
