'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    nameAr: string;
    image: string;
    alt: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    stock: number;
    brand: string;
    model: string;
    specifications: string[];
    estimatedDelivery: string;
    estimatedDeliveryAr: string;
  };
  currentLanguage: 'fr' | 'ar';
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onSaveForLater: (id: number) => void;
}

const CartItem = ({ 
  item, 
  currentLanguage, 
  onQuantityChange, 
  onRemove, 
  onSaveForLater 
}: CartItemProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (item.quantity < item.stock) {
      onQuantityChange(item.id, item.quantity + 1);
    }
  };

  const isLowStock = item.stock <= 5;
  const isOutOfStock = item.stock === 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link href={`/product-details?id=${item.id}`}>
            <div className="w-full sm:w-24 h-48 sm:h-24 bg-muted rounded-lg overflow-hidden hover:opacity-80 transition-smooth">
              <AppImage
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex-1">
              <Link href={`/product-details?id=${item.id}`}>
                <h3 className="text-lg font-semibold text-text-primary hover:text-primary transition-smooth line-clamp-2">
                  {currentLanguage === 'fr' ? item.name : item.nameAr}
                </h3>
              </Link>
              
              <div className="mt-2 space-y-1">
                <p className="text-sm text-text-secondary">
                  <span className="font-medium">
                    {currentLanguage === 'fr' ? 'Marque:' : 'العلامة التجارية:'}
                  </span> {item.brand}
                </p>
                <p className="text-sm text-text-secondary">
                  <span className="font-medium">
                    {currentLanguage === 'fr' ? 'Modèle:' : 'الطراز:'}
                  </span> {item.model}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mt-3">
                {isOutOfStock ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                    <Icon name="XCircleIcon" size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
                    {currentLanguage === 'fr' ? 'Rupture de stock' : 'نفد من المخزون'}
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                    <Icon name="ExclamationTriangleIcon" size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
                    {currentLanguage === 'fr' ? `Plus que ${item.stock} en stock` : `${item.stock} فقط متبقية`}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    <Icon name="CheckCircleIcon" size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
                    {currentLanguage === 'fr' ? 'En stock' : 'متوفر'}
                  </span>
                )}
              </div>

              {/* Estimated Delivery */}
              <div className="mt-2">
                <p className="text-sm text-text-secondary">
                  <Icon name="TruckIcon" size={14} className="inline mr-1 rtl:mr-0 rtl:ml-1" />
                  {currentLanguage === 'fr' ? item.estimatedDelivery : item.estimatedDeliveryAr}
                </p>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end space-y-4">
              {/* Price */}
              <div className="text-right rtl:text-left">
                <div className="text-xl font-bold text-text-primary">
                  {formatPrice(item.price)}
                </div>
                {item.originalPrice && item.originalPrice > item.price && (
                  <div className="text-sm text-text-secondary line-through">
                    {formatPrice(item.originalPrice)}
                  </div>
                )}
                <div className="text-sm text-text-secondary mt-1">
                  {currentLanguage === 'fr' ? 'Prix unitaire' : 'سعر الوحدة'}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={handleQuantityDecrease}
                  disabled={item.quantity <= 1 || isOutOfStock}
                  className="w-8 h-8 rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-smooth"
                >
                  <Icon name="MinusIcon" size={14} />
                </button>
                
                <div className="w-12 text-center">
                  <span className="text-sm font-medium">{item.quantity}</span>
                </div>
                
                <button
                  onClick={handleQuantityIncrease}
                  disabled={item.quantity >= item.stock || isOutOfStock}
                  className="w-8 h-8 rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-smooth"
                >
                  <Icon name="PlusIcon" size={14} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => onSaveForLater(item.id)}
                  className="px-3 py-1 text-xs font-medium text-text-secondary hover:text-primary border border-border rounded-md hover:bg-muted transition-smooth"
                >
                  <Icon name="HeartIcon" size={14} className="inline mr-1 rtl:mr-0 rtl:ml-1" />
                  {currentLanguage === 'fr' ? 'Sauvegarder' : 'حفظ للاحقاً'}
                </button>
                
                <button
                  onClick={() => onRemove(item.id)}
                  className="px-3 py-1 text-xs font-medium text-error hover:text-error/80 border border-error/20 rounded-md hover:bg-error/5 transition-smooth"
                >
                  <Icon name="TrashIcon" size={14} className="inline mr-1 rtl:mr-0 rtl:ml-1" />
                  {currentLanguage === 'fr' ? 'Supprimer' : 'حذف'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;