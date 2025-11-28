'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2, ShoppingCart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCartStore } from '@/store/useCart';
import { motion } from 'framer-motion'; // 👈 The Magic Ingredient

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').limit(8);
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

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
      const scrollAmount = 320;
      if (direction === 'left') current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      else current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Fade In */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-10"
        >
          <div className="text-left">
            <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
              {content[currentLanguage].title}
            </h2>
            <p className="text-slate-500 text-lg">
              {content[currentLanguage].subtitle}
            </p>
          </div>
          
          {/* Glassmorphism Buttons */}
          <div className="flex gap-3">
            <button onClick={() => scroll('left')} className="p-3 rounded-full bg-white/80 backdrop-blur border border-slate-200 hover:bg-white hover:shadow-lg transition-all text-slate-700">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll('right')} className="p-3 rounded-full bg-white/80 backdrop-blur border border-slate-200 hover:bg-white hover:shadow-lg transition-all text-slate-700">
              <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-violet-600" size={40} /></div>
        ) : (
          /* Animated Carousel */
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }} // Staggered Effect
                whileHover={{ y: -15, scale: 1.02 }} // THE FLOATING EFFECT
                className="min-w-[280px] md:min-w-[320px] snap-center bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex-shrink-0 relative group"
              >
                
                {/* Image Area */}
                <div className="relative h-72 bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center overflow-hidden">
                  <motion.img 
                    src={product.image_url || 'https://via.placeholder.com/300'} 
                    alt={product.name}
                    className="w-full h-full object-contain drop-shadow-xl z-10"
                    whileHover={{ scale: 1.1, rotate: 2 }} // Image Pop on Hover
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-violet-600 shadow-sm z-20">
                    {product.category}
                  </div>

                  {/* Quick Add Button (Appears on Hover) */}
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="absolute bottom-4 right-4 bg-violet-600 text-white p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:bg-violet-700"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>

                {/* Info Area */}
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-slate-400">4.8 (120)</span>
                  </div>

                  <Link href={`/product-details/${product.id}`}>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 truncate hover:text-violet-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold">Prix</span>
                      <span className="text-xl font-extrabold text-slate-900">
                        {product.price.toLocaleString()} <span className="text-sm text-violet-600">{content[currentLanguage].currency}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;