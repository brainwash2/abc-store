'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
  currentLanguage: 'fr' | 'ar';
  estimatedDelivery: string;
  estimatedDeliveryAr: string;
}

const OrderSummary = ({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  itemCount,
  currentLanguage,
  estimatedDelivery,
  estimatedDeliveryAr
}: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const summaryItems = [
    {
      label: { fr: 'Sous-total', ar: 'المجموع الفرعي' },
      value: subtotal,
      icon: 'CalculatorIcon'
    },
    {
      label: { fr: 'Livraison', ar: 'التوصيل' },
      value: shipping,
      icon: 'TruckIcon',
      isFree: shipping === 0
    },
    {
      label: { fr: 'TVA (19%)', ar: 'ضريبة القيمة المضافة (19%)' },
      value: tax,
      icon: 'DocumentTextIcon'
    }
  ];

  if (discount > 0) {
    summaryItems.push({
      label: { fr: 'Remise', ar: 'الخصم' },
      value: -discount,
      icon: 'TagIcon'
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 sticky top-24">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            {currentLanguage === 'fr' ? 'Résumé de commande' : 'ملخص الطلب'}
          </h2>
          <span className="text-sm text-text-secondary">
            {itemCount} {currentLanguage === 'fr' ? 'article(s)' : 'عنصر'}
          </span>
        </div>

        {/* Summary Items */}
        <div className="space-y-3">
          {summaryItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name={item.icon as any} size={16} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">
                  {item.label[currentLanguage]}
                </span>
                {item.isFree && (
                  <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                    {currentLanguage === 'fr' ? 'Gratuit' : 'مجاني'}
                  </span>
                )}
              </div>
              <span className={`text-sm font-medium ${
                item.value < 0 ? 'text-success' : 'text-text-primary'
              }`}>
                {item.value < 0 ? '-' : ''}{formatPrice(Math.abs(item.value))}
              </span>
            </div>
          ))}
        </div>

        <hr className="border-border" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-text-primary">
            {currentLanguage === 'fr' ? 'Total' : 'المجموع الكلي'}
          </span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Icon name="CalendarDaysIcon" size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {currentLanguage === 'fr' ? 'Livraison estimée' : 'التسليم المتوقع'}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                {currentLanguage === 'fr' ? estimatedDelivery : estimatedDeliveryAr}
              </p>
            </div>
          </div>
        </div>

        {/* Savings Badge */}
        {discount > 0 && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Icon name="SparklesIcon" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                {currentLanguage === 'fr' 
                  ? `Vous économisez ${formatPrice(discount)}` 
                  : `توفر ${formatPrice(discount)}`
                }
              </span>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-text-secondary">
          <Icon name="ShieldCheckIcon" size={16} />
          <span className="text-xs">
            {currentLanguage === 'fr' ? 'Paiement sécurisé' : 'دفع آمن'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;