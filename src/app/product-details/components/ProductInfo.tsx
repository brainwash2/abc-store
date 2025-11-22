import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProductInfoProps {
  product: {
    name: string;
    price: number;
    originalPrice?: number;
    currency: string;
    availability: 'in-stock' | 'out-of-stock' | 'limited';
    rating: number;
    reviewCount: number;
    brand: string;
    model: string;
    sku: string;
  };
  currentLanguage: 'fr' | 'ar';
}

const ProductInfo = ({ product, currentLanguage }: ProductInfoProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getAvailabilityText = () => {
    const texts = {
      'in-stock': { fr: 'En stock', ar: 'متوفر' },
      'out-of-stock': { fr: 'Rupture de stock', ar: 'غير متوفر' },
      'limited': { fr: 'Stock limité', ar: 'مخزون محدود' }
    };
    return texts[product.availability][currentLanguage];
  };

  const getAvailabilityColor = () => {
    const colors = {
      'in-stock': 'text-success',
      'out-of-stock': 'text-error',
      'limited': 'text-warning'
    };
    return colors[product.availability];
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="StarIcon" size={16} className="text-accent" variant="solid" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Icon name="StarIcon" size={16} className="text-muted" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Icon name="StarIcon" size={16} className="text-accent" variant="solid" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="StarIcon" size={16} className="text-muted" />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {product.name}
        </h1>
        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-text-secondary">
          <span>
            {currentLanguage === 'fr' ? 'Marque:' : 'العلامة التجارية:'} {product.brand}
          </span>
          <span>
            {currentLanguage === 'fr' ? 'Modèle:' : 'الطراز:'} {product.model}
          </span>
          <span>
            {currentLanguage === 'fr' ? 'SKU:' : 'رمز المنتج:'} {product.sku}
          </span>
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          {renderStars(product.rating)}
        </div>
        <span className="text-lg font-semibold text-text-primary">
          {product.rating.toFixed(1)}
        </span>
        <span className="text-text-secondary">
          ({product.reviewCount} {currentLanguage === 'fr' ? 'avis' : 'تقييم'})
        </span>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-3 rtl:space-x-reverse">
          <span className="text-4xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xl text-text-secondary line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-sm font-medium rounded">
            <Icon name="TagIcon" size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
            {currentLanguage === 'fr' ? 'Économisez' : 'وفر'} {formatPrice(product.originalPrice - product.price)}
          </div>
        )}

        {/* Currency Alternatives */}
        <div className="text-sm text-text-secondary">
          <span className="mr-2 rtl:mr-0 rtl:ml-2">
            {currentLanguage === 'fr' ? 'Environ:' : 'تقريباً:'}
          </span>
          <span className="mr-4 rtl:mr-0 rtl:ml-4">€{(product.price / 150).toFixed(2)}</span>
          <span>${(product.price / 135).toFixed(2)}</span>
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Icon 
          name={product.availability === 'in-stock' ? 'CheckCircleIcon' : 
                product.availability === 'out-of-stock' ? 'XCircleIcon' : 'ExclamationTriangleIcon'} 
          size={20} 
          className={getAvailabilityColor()} 
        />
        <span className={`font-medium ${getAvailabilityColor()}`}>
          {getAvailabilityText()}
        </span>
      </div>

      {/* Key Features */}
      <div className="bg-muted rounded-lg p-4">
        <h3 className="font-semibold text-text-primary mb-3">
          {currentLanguage === 'fr' ? 'Points clés' : 'النقاط الرئيسية'}
        </h3>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start space-x-2 rtl:space-x-reverse">
            <Icon name="CheckIcon" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <span>
              {currentLanguage === 'fr' ?'Processeur Intel Core i7 de 12ème génération' :'معالج Intel Core i7 الجيل الثاني عشر'}
            </span>
          </li>
          <li className="flex items-start space-x-2 rtl:space-x-reverse">
            <Icon name="CheckIcon" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <span>
              {currentLanguage === 'fr' ?'16 GB RAM DDR5 + 512 GB SSD NVMe' :'16 جيجابايت رام DDR5 + 512 جيجابايت SSD NVMe'}
            </span>
          </li>
          <li className="flex items-start space-x-2 rtl:space-x-reverse">
            <Icon name="CheckIcon" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <span>
              {currentLanguage === 'fr' ?'Écran 15.6" Full HD IPS' :'شاشة 15.6 بوصة Full HD IPS'}
            </span>
          </li>
          <li className="flex items-start space-x-2 rtl:space-x-reverse">
            <Icon name="CheckIcon" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <span>
              {currentLanguage === 'fr' ?'Garantie constructeur 2 ans' :'ضمان الشركة المصنعة لمدة عامين'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;