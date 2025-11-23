import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentDetails {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

interface PaymentSummaryProps {
  payment: PaymentDetails;
  currentLanguage: 'fr' | 'ar';
}

const PaymentSummary = ({ payment, currentLanguage }: PaymentSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const paymentStatusConfig = {
    paid: {
      color: 'text-success',
      icon: 'CheckCircleIcon',
      label: { fr: 'Payé', ar: 'مدفوع' }
    },
    pending: {
      color: 'text-warning',
      icon: 'ClockIcon',
      label: { fr: 'En attente', ar: 'في الانتظار' }
    },
    failed: {
      color: 'text-error',
      icon: 'XCircleIcon',
      label: { fr: 'Échec', ar: 'فشل' }
    }
  };

  const currentStatus = paymentStatusConfig[payment.paymentStatus];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        {currentLanguage === 'fr' ? 'Résumé du paiement' : 'ملخص الدفع'}
      </h2>
      
      <div className="space-y-4">
        {/* Payment Method */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <Icon name="CreditCardIcon" size={20} className="text-primary" />
            <div>
              <p className="font-medium text-text-primary">{payment.paymentMethod}</p>
              <div className="flex items-center gap-2 mt-1">
                <Icon name={currentStatus.icon as any} size={16} className={currentStatus.color} />
                <span className={`text-sm font-medium ${currentStatus.color}`}>
                  {currentStatus.label[currentLanguage]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">
              {currentLanguage === 'fr' ? 'Sous-total:' : 'المجموع الفرعي:'}
            </span>
            <span className="text-text-primary">{formatPrice(payment.subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">
              {currentLanguage === 'fr' ? 'Livraison:' : 'التوصيل:'}
            </span>
            <span className="text-text-primary">
              {payment.shipping === 0 
                ? (currentLanguage === 'fr' ? 'Gratuit' : 'مجاني')
                : formatPrice(payment.shipping)
              }
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">
              {currentLanguage === 'fr' ? 'TVA (19%):' : 'ضريبة القيمة المضافة (19%):'}
            </span>
            <span className="text-text-primary">{formatPrice(payment.tax)}</span>
          </div>
          
          {payment.discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">
                {currentLanguage === 'fr' ? 'Remise:' : 'الخصم:'}
              </span>
              <span className="text-success">-{formatPrice(payment.discount)}</span>
            </div>
          )}
          
          <hr className="border-border" />
          
          <div className="flex justify-between items-center text-lg font-semibold">
            <span className="text-text-primary">
              {currentLanguage === 'fr' ? 'Total:' : 'المجموع:'}
            </span>
            <span className="text-text-primary">{formatPrice(payment.total)}</span>
          </div>
        </div>

        {/* Invoice Download */}
        <div className="pt-4 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-smooth">
            <Icon name="DocumentArrowDownIcon" size={16} />
            {currentLanguage === 'fr' ? 'Télécharger la facture' : 'تحميل الفاتورة'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;