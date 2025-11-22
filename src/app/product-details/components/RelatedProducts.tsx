'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  availability: 'in-stock' | 'out-of-stock' | 'limited';
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  currentLanguage: 'fr' | 'ar';
  onAddToCart: (productId: number) => void;
}

const RelatedProducts = ({ products, currentLanguage, onAddToCart }: RelatedProductsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="StarIcon" size={14} className="text-accent" variant="solid" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Icon name="StarIcon" size={14} className="text-muted" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Icon name="StarIcon" size={14} className="text-accent" variant="solid" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="StarIcon" size={14} className="text-muted" />
      );
    }

    return stars;
  };

  if (products.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          {currentLanguage === 'fr' ? 'Produits similaires' : 'منتجات مشابهة'}
        </h2>
        
        {products.length > itemsPerView && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronLeftIcon" size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronRightIcon" size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-1/4 flex-shrink-0 px-2">
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-smooth group">
                <Link href={`/product-details?id=${product.id}`}>
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <AppImage
                      src={product.image}
                      alt={product.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                    {product.availability === 'out-of-stock' && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {currentLanguage === 'fr' ? 'Rupture de stock' : 'غير متوفر'}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4 space-y-3">
                  <Link href={`/product-details?id=${product.id}`}>
                    <h3 className="font-medium text-text-primary line-clamp-2 hover:text-primary transition-smooth">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    {renderStars(product.rating)}
                    <span className="text-xs text-text-secondary ml-1 rtl:ml-0 rtl:mr-1">
                      ({product.reviewCount})
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-text-secondary line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(product.id)}
                    disabled={product.availability === 'out-of-stock'}
                    className="w-full bg-primary text-primary-foreground py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Icon name="ShoppingCartIcon" size={16} />
                    <span>
                      {product.availability === 'out-of-stock'
                        ? (currentLanguage === 'fr' ? 'Indisponible' : 'غير متوفر')
                        : (currentLanguage === 'fr' ? 'Ajouter' : 'أضف')
                      }
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Dots Indicator */}
      {products.length > itemsPerView && (
        <div className="flex justify-center mt-4 space-x-2 rtl:space-x-reverse md:hidden">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-smooth ${
                index === currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;