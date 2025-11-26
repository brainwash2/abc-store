'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/common/Header';
import ProductInfo from '../components/ProductInfo';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductDescription from '../components/ProductDescription';
import { Loader2 } from 'lucide-react';

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Produit introuvable</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header cartItemCount={0} isAuthenticated={true} />
      
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Fixed: Passed productName */}
          <ProductImageGallery 
            images={[product.image_url]} 
            productName={product.name} 
          />
          
          {/* We will update ProductInfo to accept 'id' */}
          <ProductInfo 
            id={product.id} 
            name={product.name}
            price={product.price}
            rating={4.5}
            reviewCount={12}
            stockStatus={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            description={product.description}
          />
        </div>

        <div className="mt-16">
          {/* We will update ProductDescription to accept 'specifications' */}
          <ProductDescription 
            description={product.description} 
            specifications={product.specifications || {}} 
          />
        </div>
      </main>
    </div>
  );
}