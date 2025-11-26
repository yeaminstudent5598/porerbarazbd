'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Path adjusted to match the file location you provided
import { ProductForm } from '../../product-form';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Wait for session loading
    if (status === 'loading') return;

    const fetchProduct = async () => {
      // 2. Extract token
      const token = (session as any)?.accessToken;

      if (!token) {
         setError("You are not authenticated.");
         setLoading(false);
         return;
      }

      // Debugging Logs
      console.log("🔹 Editing Product ID:", id);
      console.log("🔹 Using Token:", token ? "Yes (Masked)" : "No");

      try {
        // 3. Fetch with Headers
        const res = await fetch(`/api/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` 
            },
            cache: 'no-store' // Ensure we don't get cached 404s
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            // Log server error details
            console.error("❌ Fetch Error:", data);
            throw new Error(data.message || 'Failed to fetch product');
        }
        
        console.log("✅ Product Loaded:", data.data?.name);
        setProduct(data.data);
      } catch (err: any) {
        console.error("❌ Catch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchProduct();
    } else {
        setError("Invalid Product ID");
        setLoading(false);
    }
  }, [id, session, status]);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <div>
          <h2 className="text-lg font-semibold">Error Loading Product</h2>
          <p className="text-sm text-muted-foreground">{error || "Product not found"}</p>
          <p className="text-xs text-gray-400 mt-1">ID: {id}</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProductForm initialData={product} isEditMode={true} />
    </div>
  );
}