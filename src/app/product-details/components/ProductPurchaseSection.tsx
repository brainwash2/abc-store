'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

interface ProductPurchaseSectionProps {
  variants: ProductVariant[];
  currentLanguage: 'fr' | 'ar';
  onAddToCart: (quantity: number, variantId: string) => void;
  onBuyNow: (quantity: number, variantId: string) => void;
  onAddToWishlist: () => void;
  isInWishlist: boolean;
}

const ProductPurchaseSection = ({
  variants,
  currentLanguage,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  isInWishlist
}: ProductPurchaseSectionProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.id || '');

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    onBuyNow(quantity, selectedVariant);
  };

  const selectedVariantData = variants.find(v => v.id === selectedVariant);

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6 sticky top-24">
      <h3 className="text-lg font-semibold text-text-primary">
        {currentLanguage === 'fr' ? 'Options d\'achat' : 'خيارات الشراء'}
      </h3>

      {/* Variant Selection */}
      {variants.length > 1 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">
            {currentLanguage === 'fr' ? 'Configuration' : 'التكوين'}
          </label>
          <div className="grid grid-cols-1 gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                disabled={!variant.available}
                className={`p-3 border rounded-lg text-left rtl:text-right transition-smooth ${
                  selectedVariant === variant.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                } ${!variant.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-text-primary">{variant.name}</span>
                  <span className="text-primary font-semibold">
                    {new Intl.NumberFormat('fr-DZ', {
                      style: 'currency',
                      currency: 'DZD',
                      minimumFractionDigits: 0,
                    }).format(variant.price)}
                  </span>
                </div>
                {!variant.available && (
                  <span className="text-xs text-error">
                    {currentLanguage === 'fr' ? 'Non disponible' : 'غير متوفر'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          {currentLanguage === 'fr' ? 'Quantité' : 'الكمية'}
        </label>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="MinusIcon" size={16} />
          </button>
          <span className="w-16 text-center font-medium text-lg">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="PlusIcon" size={16} />
          </button>
        </div>
        <p className="text-xs text-text-secondary">
          {currentLanguage === 'fr' ? 'Maximum 10 unités par commande' : 'الحد الأقصى 10 وحدات لكل طلب'}
        </p>
      </div>

      {/* Total Price */}
      {selectedVariantData && (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">
              {currentLanguage === 'fr' ? 'Total' : 'المجموع'}
            </span>
            <span className="text-xl font-bold text-primary">
              {new Intl.NumberFormat('fr-DZ', {
                style: 'currency',
                currency: 'DZD',
                minimumFractionDigits: 0,
              }).format(selectedVariantData.price * quantity)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariantData?.available}
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <Icon name="ShoppingCartIcon" size={20} />
          <span>
            {currentLanguage === 'fr' ? 'Ajouter au panier' : 'أضف إلى السلة'}
          </span>
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!selectedVariantData?.available}
          className="w-full bg-accent text-accent-foreground py-3 px-4 rounded-lg font-medium hover:bg-accent/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <Icon name="BoltIcon" size={20} />
          <span>
            {currentLanguage === 'fr' ? 'Acheter maintenant' : 'اشتري الآن'}
          </span>
        </button>

        <button
          onClick={onAddToWishlist}
          className="w-full border border-border py-3 px-4 rounded-lg font-medium hover:bg-muted transition-smooth flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <Icon 
            name="HeartIcon" 
            size={20} 
            variant={isInWishlist ? 'solid' : 'outline'}
            className={isInWishlist ? 'text-error' : 'text-text-secondary'}
          />
          <span>
            {isInWishlist 
              ? (currentLanguage === 'fr' ? 'Dans la liste de souhaits' : 'في قائمة الأمنيات')
              : (currentLanguage === 'fr' ? 'Ajouter aux favoris' : 'أضف إلى المفضلة')
            }
          </span>
        </button>
      </div>

      {/* Payment Options */}
      <div className="border-t border-border pt-4 space-y-3">
        <h4 className="text-sm font-medium text-text-primary">
          {currentLanguage === 'fr' ? 'Options de paiement' : 'خيارات الدفع'}
        </h4>
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-text-secondary">
          <Icon name="CreditCardIcon" size={16} />
          <span>Baridi Mob</span>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-text-secondary">
          <Icon name="ChatBubbleLeftRightIcon" size={16} />
          <span>WhatsApp</span>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-text-secondary">
          <Icon name="BanknotesIcon" size={16} />
          <span>
            {currentLanguage === 'fr' ? 'Paiement à la livraison' : 'الدفع عند التسليم'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductPurchaseSection;