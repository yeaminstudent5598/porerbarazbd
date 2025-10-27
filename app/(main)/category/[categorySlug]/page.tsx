// app/(main)/category/[categorySlug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { CategoryService } from '@/modules/category/category.service';
import { ICategory } from '@/modules/category/category.interface';

interface CategoryPageProps {
  params: {
    categorySlug: string;
  };
}

// Async Server Component
const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { categorySlug } = params;

  // ক্যাটাগরি fetch
  const category: ICategory | null = await CategoryService.getCategoryByIdOrSlugFromDB(categorySlug);

  if (!category) {
    return notFound(); // 404 পেজ
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Category: {category.name}</h1>
      <img src={category.imageUrl} alt={category.name} style={{ maxWidth: '300px', borderRadius: '8px' }} />
      <p>Slug: {category.slug}</p>
      {/* পরে এখানে category products map করে দেখানো যাবে */}
    </div>
  );
};

export default CategoryPage;
