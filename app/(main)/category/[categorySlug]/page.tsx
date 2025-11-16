// app/(main)/category/[categorySlug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { ProductService } from '@/modules/product/product.service';
import { CategoryService } from '@/modules/category/category.service';
import { IProduct } from '@/modules/product/product.interface';
import { ICategory } from '@/modules/category/category.interface';
import dbConnect from '@/app/lib/dbConnect';
import { ProductCard } from '@/app/components/shared/ProductCard';

export const revalidate = 3600; // 1 hour

async function getCategoryData(slug: string): Promise<{ category: ICategory | null, products: IProduct[] }> {
  try {
    await dbConnect();

    const category = await CategoryService.getCategoryByIdOrSlugFromDB(slug);
    if (!category) return { category: null, products: [] };

    const productResult = await ProductService.getAllProductsFromDB({
      category: category.name,
      status: 'Active',
    });

    // Map Mongoose docs to IProduct
    const products: IProduct[] = productResult.data.map((doc: any) => ({
      _id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      oldPrice: doc.oldPrice,
      stock: doc.stock,
      category: doc.category,
      imageUrl: doc.imageUrl,
      status: doc.status,
      discount: doc.discount,
      rating: doc.rating,
      reviewsCount: doc.reviewsCount,
      weight: doc.weight,
      ingredients: doc.ingredients,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return { category, products };
  } catch (error) {
    console.error(`Error fetching category data for ${slug}:`, error);
    return { category: null, products: [] };
  }
}

export async function generateMetadata({ params }: { params: { categorySlug: string } }) {
  try {
    await dbConnect();
    const category = await CategoryService.getCategoryByIdOrSlugFromDB(params.categorySlug);
    if (!category) return { title: 'Category Not Found' };

    return {
      title: `${category.name} | PorerbazarBD`,
      description: `Browse all products in the ${category.name} category.`,
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return { title: "Error" };
  }
}

export default async function CategoryPage({ params }: { params: { categorySlug: string } }) {
  const { categorySlug } = params;
  const { category, products } = await getCategoryData(categorySlug);

  if (!category) notFound();

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Category: <span className="text-green-700">{category.name}</span>
        </h1>

        <main>
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No products found in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={{
                    id: p._id!, // required for ProductCard
                    name: p.name,
                    imageUrl: p.imageUrl,
                    newPrice: p.price,
                    oldPrice: p.oldPrice,
                    discount: p.discount,
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
