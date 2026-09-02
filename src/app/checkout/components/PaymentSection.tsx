import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentMethod {
  id: string;
  name: {fr: string;ar: string;};
  description: {fr: string;ar: string;};
  icon: string;
  type: 'whatsapp' | 'cash' | 'card';
}

interface PaymentSectionProps {
  currentLanguage: 'fr' | 'ar';
  selectedPaymentMethod: string | null;
  onPaymentMethodSelect: (id: string) => void;
}

const PaymentSection = ({
  currentLanguage,
  selectedPaymentMethod,
  onPaymentMethodSelect
}: PaymentSectionProps) => {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'chargily',
      name: { fr: 'Carte CIB / Edahabia', ar: 'بطاقة CIB / الذهبية' },
      description: { fr: 'Paiement en ligne sécurisé via Chargily', ar: 'دفع آمن عبر الإنترنت عبر Chargily' },
      icon: 'CreditCardIcon',
      type: 'card'
    },
    {
      id: 'whatsapp',
      name: { fr: 'WhatsApp', ar: 'واتساب' },
      description: { fr: 'Commande via WhatsApp', ar: 'الطلب عبر واتساب' },
      icon: 'ChatBubbleLeftRightIcon',
      type: 'whatsapp'
    },
    {
      id: 'cash_delivery',
      name: { fr: 'Paiement à la Livraison', ar: 'الدفع عند التسليم' },
      description: { fr: 'Payez en espèces lors de la réception', ar: 'ادفع نقداً عند الاستلام' },
      icon: 'BanknotesIcon',
      type: 'cash'
    }
  ];

  const renderPaymentForm = () => {
    if (!selectedPaymentMethod) return null;

    switch (selectedPaymentMethod) {
      case 'chargily':
        return (
          <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                <Icon name="CreditCardIcon" size={24} className="text-violet-600" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">
                  {currentLanguage === 'fr' ? 'Paiement par carte CIB / Edahabia' : 'الدفع ببطاقة CIB / الذهبية'}
                </h4>
                <p className="text-sm text-text-secondary">
                  {currentLanguage === 'fr'
                    ? 'Vous serez redirigé vers Chargily Pay pour finaliser le paiement.'
                    : 'سيتم توجيهك إلى Chargily Pay لإتمام الدفع.'}
                </p>
              </div>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-sm text-violet-700">
              {currentLanguage === 'fr'
                ? 'Transaction sécurisée, sans stockage de vos données bancaires.'
                : 'عملية آمنة، لا يتم تخزين بياناتك المصرفية.'}
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">
                  {currentLanguage === 'fr' ? 'Commande WhatsApp' : 'طلب واتساب'}
                </h4>
                <p className="text-sm text-text-secondary">
                  {currentLanguage === 'fr' ? 'Un message sera généré automatiquement' : 'سيتم إنشاء رسالة تلقائياً'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'cash_delivery':
        return (
          <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <Icon name="BanknotesIcon" size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">
                  {currentLanguage === 'fr' ? 'Paiement à la Livraison' : 'الدفع عند التسليم'}
                </h4>
                <p className="text-sm text-text-secondary">
                  {currentLanguage === 'fr' ? 'Payez en espèces lors de la réception de votre commande' : 'ادفع نقداً عند استلام طلبك'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        {currentLanguage === 'fr' ? 'Mode de Paiement' : 'طريقة الدفع'}
      </h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition-smooth ${
              selectedPaymentMethod === method.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onPaymentMethodSelect(method.id)}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === method.id ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {selectedPaymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  method.type === 'whatsapp' ? 'bg-green-100' :
                  method.type === 'cash' ? 'bg-amber-100' : 'bg-violet-100'
                }`}>
                  <Icon
                    name={method.icon as any}
                    size={20}
                    className={
                      method.type === 'whatsapp' ? 'text-green-600' :
                      method.type === 'cash' ? 'text-amber-600' : 'text-violet-600'
                    }
                  />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{method.name[currentLanguage]}</p>
                  <p className="text-sm text-text-secondary">{method.description[currentLanguage]}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderPaymentForm()}

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <Icon name="ShieldCheckIcon" size={20} className="text-success mt-0.5" />
          <div>
            <h4 className="font-medium text-text-primary mb-2">
              {currentLanguage === 'fr' ? 'Paiement Sécurisé' : 'دفع آمن'}
            </h4>
            <p className="text-sm text-text-secondary">
              {currentLanguage === 'fr'
                ? 'Vos informations de paiement sont protégées par un cryptage SSL 256 bits. Nous ne stockons jamais vos données bancaires.'
                : 'معلومات الدفع الخاصة بك محمية بتشفير SSL 256 بت. نحن لا نحتفظ أبداً ببياناتك المصرفية.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
