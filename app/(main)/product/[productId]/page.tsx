'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Minus, Plus, ShoppingCart, Heart, Loader2, Truck } from 'lucide-react';
import { ProductCard } from '@/app/components/shared/ProductCard';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/app/lib/fetcher';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    // Params থেকে ID বের করা এবং চেক করা
    const rawId = Array.isArray(params.productId) ? params.productId[0] : params.productId;
    // ✅ FIX: যদি ID 'undefined' স্ট্রিং হয়, তবে null সেট করুন
    const productId = rawId && rawId !== 'undefined' ? rawId : null;

    const [quantity, setQuantity] = useState(1);
    const [isAddingCart, setIsAddingCart] = useState(false);
    const [isWishlisting, setIsWishlisting] = useState(false);

    // ✅ FIX: productId null হলে SWR কল হবে না
    const { data: productRes, isLoading } = useSWR(
        productId ? `/api/products/${productId}` : null, 
        fetcher
    );
    
    const product = productRes?.data;

    // Related Products Fetching
    const { data: relatedRes } = useSWR(
        product?.category ? `/api/products?category=${product.category}&limit=5` : null, 
        fetcher
    );
    
    const relatedProducts = relatedRes?.data?.filter((p: any) => p._id !== productId).slice(0, 4) || [];

    const handleAddToCart = async () => {
        if (!session) {
            toast.error("Please login to add items to cart");
            router.push('/auth/login');
            return;
        }

        setIsAddingCart(true);
        try {
            const res = await fetch('/api/v1/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(session as any).accessToken}`
                },
                body: JSON.stringify({ productId: product._id, quantity })
            });

            if(!res.ok) throw new Error("Failed to add");
            
            toast.success("Added to cart successfully!");
            mutate('/api/v1/cart');
        } catch (err) {
            toast.error("Could not add to cart");
        } finally {
            setIsAddingCart(false);
        }
    };

    const handleWishlist = async () => {
        if (!session) {
            toast.error("Login required");
            return;
        }
        setIsWishlisting(true);
        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(session as any).accessToken}`
                },
                body: JSON.stringify({ productId: product._id })
            });
            const data = await res.json();
            toast.success(data.message);
        } catch(err) {
            toast.error("Failed to update wishlist");
        } finally {
            setIsWishlisting(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-green-600"/></div>;
    }

    if (!productId || !product) {
        return (
            <div className="container mx-auto px-4 py-24 text-center min-h-[70vh]">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Product Not Found!</h2>
                <p className="text-gray-600 mb-8 text-lg">The product you are looking for does not exist.</p>
                <Button asChild size="lg"><Link href="/products">Back to Shop</Link></Button>
            </div>
        );
    }

    return (
        <section className="py-10 md:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-12">
                    
                    {/* Image Gallery */}
                    <div className="sticky top-24">
                        <div className="border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center h-[400px] relative">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                                <div className="text-gray-400">No Image</div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-5">
                         <h1 className="text-2xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
                         
                         <div className="flex items-center gap-3">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "text-yellow-500" : "text-gray-300"} />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">({product.reviewsCount || 0} reviews)</span>
                         </div>

                         <div className="flex items-baseline gap-3">
                             <span className="text-3xl font-bold text-green-700">৳ {product.price}</span>
                             {product.oldPrice && <span className="text-xl text-gray-400 line-through">৳ {product.oldPrice}</span>}
                             {product.discount && <Badge variant="destructive">{product.discount}</Badge>}
                         </div>

                         <div className="flex items-center gap-2">
                            {product.stock > 0 
                                ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 pointer-events-none">In Stock ({product.stock})</Badge>
                                : <Badge variant="destructive" className="pointer-events-none">Out of Stock</Badge>
                            }
                         </div>

                         <p className="text-gray-600 leading-relaxed">{product.description}</p>

                         <Separator />

                         <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center border rounded-md h-12 w-fit">
                                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3 h-full hover:bg-gray-100" disabled={product.stock <= 0}><Minus size={16}/></button>
                                <input type="text" value={quantity} readOnly className="w-12 text-center h-full border-x font-semibold focus:outline-none"/>
                                <button onClick={() => setQuantity(q => q+1)} className="px-3 h-full hover:bg-gray-100" disabled={product.stock <= 0}><Plus size={16}/></button>
                            </div>

                            <Button 
                                size="lg" 
                                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0 || isAddingCart}
                            >
                                {isAddingCart ? <Loader2 className="animate-spin mr-2"/> : <ShoppingCart className="mr-2" size={18}/>}
                                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                            </Button>

                            <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleWishlist} disabled={isWishlisting}>
                                <Heart size={20} className={isWishlisting ? "text-red-500 fill-current" : ""}/>
                            </Button>
                         </div>

                         <div className="text-sm text-gray-500 space-y-2 pt-2">
                            <div className="flex items-center gap-2">
                                <Truck size={16} className="text-green-600"/>
                                <span>ঢাকার ভিতরে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ৩-৫ দিনে ডেলিভারি।</span>
                            </div>
                            <p>Category: <Link href={`/products?category=${product.category}`} className="text-blue-600 hover:underline">{product.category}</Link></p>
                            {product.weight && <p>Weight: {product.weight}</p>}
                         </div>
                    </div>
                </div>

                <Tabs defaultValue="description" className="w-full mt-16">
                    <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="prose max-w-none text-gray-700">
                        <p>{product.description}</p>
                        {product.ingredients && product.ingredients.length > 0 && (
                            <p className="mt-2"><strong>Ingredients:</strong> {product.ingredients.join(', ')}</p>
                        )}
                    </TabsContent>
                    <TabsContent value="reviews" className="text-gray-700">
                        <p>No reviews yet.</p>
                    </TabsContent>
                </Tabs>
                
                {relatedProducts.length > 0 && (
                    <div className="mt-16 border-t pt-10">
                        <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p: any) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}