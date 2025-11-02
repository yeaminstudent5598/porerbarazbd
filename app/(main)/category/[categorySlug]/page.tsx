// app/(main)/category/[categorySlug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { ProductService } from '@/modules/product/product.service';
import { CategoryService } from '@/modules/category/category.service';
import { IProduct } from '@/modules/product/product.interface';
import { ICategory } from '@/modules/category/category.interface';
import dbConnect from '@/app/lib/dbConnect';

export const revalidate = 3600; // 1 hour

async function getCategoryData(slug: string): Promise<{ category: ICategory | null, products: IProduct[] }> {
  try {
    await dbConnect(); 
    // ------------------------------------------------

    const category = await CategoryService.getCategoryByIdOrSlugFromDB(slug);
    
    if (!category) {
      console.warn(`Category not found for slug: ${slug}`);
      return { category: null, products: [] };
    }

    const productResult = await ProductService.getAllProductsFromDB({
      category: category.name,
      status: 'Active'
    });

    return { category, products: productResult.data };

  } catch (error) {
    console.error(`Error fetching category data for ${slug}:`, error);
    return { category: null, products: [] };
  }
}

export async function generateMetadata({ params }: { params: { categorySlug: string } }) {
    try {
        await dbConnect(); 
        const category = await CategoryService.getCategoryByIdOrSlugFromDB(params.categorySlug);
        if (!category) {
            return { title: 'Category Not Found' };
        }
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

  if (!category) {
    notFound(); 
  }

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
              {/* TODO: Add a "Shop All" button */}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                // @ts-ignore // Mongoose _id vs string issue (can be fixed in interface)
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}