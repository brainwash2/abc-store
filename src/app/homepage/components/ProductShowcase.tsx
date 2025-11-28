'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2, ShoppingCart, ChevronLeft, ChevronRight, Star, Eye } from 'lucide-react';
import { useCartStore } from '@/store/useCart';
import { motion } from 'framer-motion';

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const addItem = useCartStore((state) => state.addItem);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').limit(8);
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Smart Scroll Detection (Hides arrows if you can't scroll further)
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
    }
    return () => container?.removeEventListener('scroll', checkScroll);
  }, [products]);

  const content = {
    fr: { title: "Produits en Vedette", subtitle: "Les meilleures offres du moment", currency: "DA" },
    ar: { title: "منتجات مميزة", subtitle: "أفضل العروض في الوقت الحالي", currency: "د.ج" }
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
    alert(currentLanguage === 'fr' ? "Ajouté !" : "تمت الإضافة!");
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 340;
      if (direction === 'left') current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      else current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorative blob (Subtle) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-50 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* 1. Centered Header with Animation */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            {content[currentLanguage].title}
          </motion.h2>
          
          {/* Decorative Line */}
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-1.5 bg-violet-600 mx-auto rounded-full mb-6"
          />

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 text-lg md:text-xl"
          >
            {content[currentLanguage].subtitle}
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-violet-600" size={40} /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Aucun produit disponible.</div>
        ) : (
          <div className="relative group/carousel">
            
            {/* 2. Floating Navigation Arrows (Vertically Centered) */}
            {/* Only show on Desktop to keep mobile clean */}
            {canScrollLeft && (
              <button 
                onClick={() => scroll('left')} 
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex w-12 h-12 items-center justify-center bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-lg text-slate-700 hover:bg-violet-600 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {canScrollRight && (
              <button 
                onClick={() => scroll('right')} 
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex w-12 h-12 items-center justify-center bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-lg text-slate-700 hover:bg-violet-600 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* 3. The Carousel Container */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory scrollbar-hide px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="min-w-[280px] md:min-w-[320px] snap-center bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-violet-100/50 transition-all duration-500 flex-shrink-0 relative overflow-hidden group"
                >
                  {/* Image Area */}
                  <div className="relative h-72 p-8 flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
                    <Link href={`/product-details/${product.id}`} className="w-full h-full flex items-center justify-center">
                      <motion.img 
                        src={product.image_url || 'https://via.placeholder.com/300'} 
                        alt={product.name}
                        className="max-h-full max-w-full object-contain drop-shadow-md z-10"
                        whileHover={{ scale: 1.15, rotate: -2, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </Link>
                    
                    {/* Floating Category Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm border border-slate-100 z-20">
                      {product.category}
                    </div>

                    {/* Hover Actions Overlay (Slide Up) */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-30">
                      <Link href={`/product-details/${product.id}`} className="p-3 bg-white text-slate-700 rounded-full shadow-lg hover:bg-slate-50 hover:text-violet-600 transition-colors" title="Voir détails">
                        <Eye size={20} />
                      </Link>
                      <button onClick={() => handleAddToCart(product)} className="p-3 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 transition-colors" title="Ajouter au panier">
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-400">4.8</span>
                    </div>

                    <Link href={`/product-details/${product.id}`}>
                      <h3 className="font-bold text-slate-900 mb-1 truncate hover:text-violet-600 transition-colors text-lg">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-1">
                      {product.description || product.name}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                      <span className="text-xl font-extrabold text-slate-900">
                        {product.price.toLocaleString()} <span className="text-xs font-medium text-slate-400">{content[currentLanguage].currency}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link href="/product-catalog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-violet-600 pb-1">
            {currentLanguage === 'fr' ? 'Explorer le catalogue' : 'تصفح الكتالوج'}
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;