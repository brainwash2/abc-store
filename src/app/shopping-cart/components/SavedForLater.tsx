'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface SavedItem {
  id: number;
  name: string;
  nameAr: string;
  image: string;
  alt: string;
  price: number;
  originalPrice?: number;
  brand: string;
  stock: number;
}

interface SavedForLaterProps {
  savedItems: SavedItem[];
  currentLanguage: 'fr' | 'ar';
  onMoveToCart: (id: number) => void;
  onRemove: (id: number) => void;
}

const SavedForLater = ({ 
  savedItems, 
  currentLanguage, 
  onMoveToCart, 
  onRemove 
}: SavedForLaterProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (savedItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          {currentLanguage === 'fr' ? 'Sauvegardé pour plus tard' : 'محفوظ للاحقاً'}
        </h2>
        <span className="text-sm text-text-secondary">
          {savedItems.length} {currentLanguage === 'fr' ? 'article(s)' : 'عنصر'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {savedItems.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
            <Link href={`/product-details?id=${item.id}`}>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 hover:opacity-80 transition-smooth">
                <AppImage
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <div className="space-y-2">
              <Link href={`/product-details?id=${item.id}`}>
                <h3 className="font-medium text-text-primary hover:text-primary transition-smooth line-clamp-2 text-sm">
                  {currentLanguage === 'fr' ? item.name : item.nameAr}
                </h3>
              </Link>

              <p className="text-xs text-text-secondary">
                {item.brand}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-primary">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="text-xs text-text-secondary line-through">
                      {formatPrice(item.originalPrice)}
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                <div>
                  {item.stock === 0 ? (
                    <span className="text-xs text-error">
                      {currentLanguage === 'fr' ? 'Rupture' : 'نفد'}
                    </span>
                  ) : item.stock <= 5 ? (
                    <span className="text-xs text-warning">
                      {currentLanguage === 'fr' ? `${item.stock} restant` : `${item.stock} متبقي`}
                    </span>
                  ) : (
                    <span className="text-xs text-success">
                      {currentLanguage === 'fr' ? 'En stock' : 'متوفر'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 rtl:space-x-reverse pt-2">
                <button
                  onClick={() => onMoveToCart(item.id)}
                  disabled={item.stock === 0}
                  className="flex-1 px-3 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                >
                  <Icon name="ShoppingCartIcon" size={14} className="inline mr-1 rtl:mr-0 rtl:ml-1" />
                  {currentLanguage === 'fr' ? 'Ajouter' : 'إضافة'}
                </button>
                
                <button
                  onClick={() => onRemove(item.id)}
                  className="px-3 py-2 text-xs font-medium text-error border border-error/20 rounded-md hover:bg-error/5 transition-smooth"
                >
                  <Icon name="TrashIcon" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedForLater;