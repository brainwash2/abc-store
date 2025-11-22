'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface CheckoutActionsProps {
  currentLanguage: 'fr' | 'ar';
  total: number;
  itemCount: number;
  isCartEmpty: boolean;
  onProceedToCheckout: () => void;
}

const CheckoutActions = ({
  currentLanguage,
  total,
  itemCount,
  isCartEmpty,
  onProceedToCheckout
}: CheckoutActionsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (isCartEmpty) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 mt-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Total Summary */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="text-center lg:text-left rtl:lg:text-right">
            <p className="text-sm text-text-secondary">
              {currentLanguage === 'fr' ? 'Total du panier' : 'مجموع السلة'}
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(total)}
            </p>
          </div>
          
          <div className="hidden lg:block w-px h-12 bg-border" />
          
          <div className="text-center lg:text-left rtl:lg:text-right">
            <p className="text-sm text-text-secondary">
              {currentLanguage === 'fr' ? 'Articles' : 'العناصر'}
            </p>
            <p className="text-lg font-semibold text-text-primary">
              {itemCount} {currentLanguage === 'fr' ? 'article(s)' : 'عنصر'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
          <Link
            href="/product-catalog"
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon name="ArrowLeftIcon" size={20} className="mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
            {currentLanguage === 'fr' ? 'Continuer les achats' : 'متابعة التسوق'}
          </Link>
          
          <button
            onClick={onProceedToCheckout}
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-smooth shadow-elevation-1 hover:shadow-elevation-2"
          >
            <Icon name="CreditCardIcon" size={20} className="mr-2 rtl:mr-0 rtl:ml-2" />
            {currentLanguage === 'fr' ? 'Procéder au paiement' : 'المتابعة للدفع'}
            <Icon name="ArrowRightIcon" size={20} className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Security Features */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="ShieldCheckIcon" size={16} className="text-success" />
            <span>{currentLanguage === 'fr' ? 'Paiement sécurisé' : 'دفع آمن'}</span>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="TruckIcon" size={16} className="text-primary" />
            <span>{currentLanguage === 'fr' ? 'Livraison rapide' : 'توصيل سريع'}</span>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="ArrowPathIcon" size={16} className="text-accent" />
            <span>{currentLanguage === 'fr' ? 'Retour gratuit' : 'إرجاع مجاني'}</span>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="ChatBubbleLeftRightIcon" size={16} className="text-secondary" />
            <span>{currentLanguage === 'fr' ? 'Support 24/7' : 'دعم 24/7'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutActions;