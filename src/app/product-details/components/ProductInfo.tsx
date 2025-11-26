'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useCartStore } from '@/store/useCart';

interface ProductInfoProps {
  id: any; // Added ID
  name: string; // Simplified props to match parent
  price: number;
  rating: number;
  reviewCount: number;
  stockStatus: string; // 'In Stock' or 'Out of Stock'
  description: string;
  currentLanguage?: 'fr' | 'ar'; // Optional
}

const ProductInfo = ({ 
  id, 
  name, 
  price, 
  rating, 
  reviewCount, 
  stockStatus, 
  description,
  currentLanguage = 'fr' 
}: ProductInfoProps) => {
  
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    if (!price) return '0 DZD';
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Map DB status to UI status
  const availability = stockStatus === 'In Stock' ? 'in-stock' : 'out-of-stock';

  const getAvailabilityText = () => {
    const texts = {
      'in-stock': { fr: 'En stock', ar: 'متوفر' },
      'out-of-stock': { fr: 'Rupture de stock', ar: 'غير متوفر' },
    };
    return texts[availability][currentLanguage];
  };

  const getAvailabilityColor = () => {
    return availability === 'in-stock' ? 'text-green-600' : 'text-red-600';
  };

  const handleAddToCart = () => {
    // 🛡️ SAFETY CHECK: Don't run if ID is missing
    if (!id) return;

    addItem({
      id: id.toString(),
      name: name,
      price: price,
      image: '', 
      quantity: 1
    } as any);
    alert("Ajouté au panier !");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon key={i} name="StarIcon" size={16} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"} variant="solid" />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{name}</h1>
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          {/* 🛡️ SAFETY CHECK: Only show SKU if ID exists */}
          <span>SKU: {id ? id.toString().slice(0, 8) : '...'}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          {renderStars(rating || 0)}
        </div>
        <span className="text-lg font-semibold text-slate-900">{(rating || 0).toFixed(1)}</span>
        <span className="text-slate-500">({reviewCount || 0} avis)</span>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl font-bold text-violet-600">{formatPrice(price)}</span>
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-2">
        <Icon name={availability === 'in-stock' ? 'CheckCircleIcon' : 'XCircleIcon'} size={20} className={getAvailabilityColor()} />
        <span className={`font-medium ${getAvailabilityColor()}`}>
          {getAvailabilityText()}
        </span>
      </div>

      {/* Description Preview */}
      <p className="text-slate-600 leading-relaxed line-clamp-3">{description}</p>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button 
          onClick={handleAddToCart}
          disabled={availability === 'out-of-stock' || !id}
          className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="ShoppingCartIcon" size={20} />
          {currentLanguage === 'fr' ? 'Ajouter au panier' : 'إضافة إلى السلة'}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;