'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/useCart';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
}

interface ProductShowcaseProps {
  currentLanguage: 'fr' | 'ar';
}

const ProductShowcase = ({ currentLanguage }: ProductShowcaseProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  
  // Ref for the scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      // Fetch 8 products so we have enough to scroll
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(8);
      
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const content = {
    fr: {
      title: "Produits en Vedette",
      subtitle: "Les meilleures offres du moment",
      addToCart: "Ajouter",
      currency: "DA"
    },
    ar: {
      title: "منتجات مميزة",
      subtitle: "أفضل العروض في الوقت الحالي",
      addToCart: "إضافة",
      currency: "د.ج"
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      title: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1
    } as any);
    alert(currentLanguage === 'fr' ? "Ajouté au panier !" : "تمت الإضافة إلى السلة!");
  };

  // Scroll Logic
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 320; // Width of one card + gap
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Arrows */}
        <div className="flex justify-between items-end mb-8">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {content[currentLanguage].title}
            </h2>
            <p className="text-slate-500">
              {content[currentLanguage].subtitle}
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')} 
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all text-slate-600"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all text-slate-600"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Aucun produit disponible.
          </div>
        ) : (
          /* Carousel Container */
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="min-w-[280px] md:min-w-[300px] snap-center group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex-shrink-0"
              >
                {/* Image */}
                <div className="relative h-64 bg-white p-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/300'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white rounded-md px-3 py-1 text-xs font-bold shadow-sm">
                    {product.category}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <Link href={`/product-details/${product.id}`}>
                    <h3 className="font-bold text-slate-900 mb-1 truncate hover:text-primary transition-colors" title={product.name}>
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">
                    {product.description || product.name}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {product.price.toLocaleString()} {content[currentLanguage].currency}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-primary hover:text-white transition-colors"
                      title={content[currentLanguage].addToCart}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-4">
          <Link href="/product-catalog" className="text-primary font-semibold hover:underline">
            {currentLanguage === 'fr' ? 'Voir tous les produits →' : '← عرض جميع المنتجات'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;