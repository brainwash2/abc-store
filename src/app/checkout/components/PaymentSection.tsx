import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface PaymentMethod {
  id: string;
  name: {fr: string;ar: string;};
  description: {fr: string;ar: string;};
  icon: string;
  type: 'baridi' | 'whatsapp' | 'cash' | 'card';
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
    id: 'baridi_mob',
    name: { fr: 'Baridi Mob', ar: 'بريدي موب' },
    description: { fr: 'Paiement sécurisé via Baridi Mob', ar: 'دفع آمن عبر بريدي موب' },
    icon: 'CreditCardIcon',
    type: 'baridi'
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
  }];


  const renderPaymentForm = () => {
    if (!selectedPaymentMethod) return null;

    switch (selectedPaymentMethod) {
      case 'baridi_mob':
        return (
          <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_146c198da-1763322461678.png"
                alt="Baridi Mob logo with green and blue colors on white background"
                className="w-16 h-10 object-contain" />

              <div>
                <h4 className="font-medium text-text-primary">
                  {currentLanguage === 'fr' ? 'Paiement Baridi Mob' : 'دفع بريدي موب'}
                </h4>
                <p className="text-sm text-text-secondary">
                  {currentLanguage === 'fr' ? 'Vous serez redirigé vers la plateforme sécurisée' : 'سيتم توجيهك إلى المنصة الآمنة'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-success">
              <Icon name="ShieldCheckIcon" size={16} />
              <span>
                {currentLanguage === 'fr' ? 'Paiement 100% sécurisé avec SSL' : 'دفع آمن 100% مع SSL'
                }
              </span>
            </div>
          </div>);


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
                  {currentLanguage === 'fr' ? 'Un message sera généré automatiquement' : 'سيتم إنشاء رسالة تلقائياً'
                  }
                </p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800 mb-2">
                {currentLanguage === 'fr' ? 'Aperçu du message:' : 'معاينة الرسالة:'}
              </p>
              <div className="bg-white p-3 rounded border text-sm">
                <p className="font-medium">
                  {currentLanguage === 'fr' ? 'Bonjour ABC Informatique,' : 'مرحباً ABC Informatique،'
                  }
                </p>
                <p className="mt-1">
                  {currentLanguage === 'fr' ? 'Je souhaite passer commande pour les produits suivants:' : 'أرغب في طلب المنتجات التالية:'
                  }
                </p>
                <p className="text-text-secondary mt-1">
                  {currentLanguage === 'fr' ? '[Détails de la commande...]' : '[تفاصيل الطلب...]'}
                </p>
              </div>
            </div>
          </div>);


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
                  {currentLanguage === 'fr' ? 'Payez en espèces lors de la réception de votre commande' : 'ادفع نقداً عند استلام طلبك'
                  }
                </p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <Icon name="InformationCircleIcon" size={16} className="text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">
                    {currentLanguage === 'fr' ? 'Important:' : 'مهم:'}
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>
                      {currentLanguage === 'fr' ? '• Préparez le montant exact si possible' : '• حضر المبلغ الدقيق إن أمكن'
                      }
                    </li>
                    <li>
                      {currentLanguage === 'fr' ? '• Vérifiez les produits avant paiement' : '• تحقق من المنتجات قبل الدفع'
                      }
                    </li>
                    <li>
                      {currentLanguage === 'fr' ? '• Frais de livraison inclus dans le total' : '• رسوم التوصيل مشمولة في المجموع'
                      }
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>);


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
        {paymentMethods.map((method) =>
        <div
          key={method.id}
          className={`border rounded-lg p-4 cursor-pointer transition-smooth ${
          selectedPaymentMethod === method.id ?
          'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`
          }
          onClick={() => onPaymentMethodSelect(method.id)}>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedPaymentMethod === method.id ?
            'border-primary bg-primary' : 'border-border'}`
            }>
                {selectedPaymentMethod === method.id &&
              <div className="w-2 h-2 bg-white rounded-full" />
              }
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              method.type === 'baridi' ? 'bg-blue-100' :
              method.type === 'whatsapp' ? 'bg-green-100' :
              method.type === 'cash' ? 'bg-amber-100' : 'bg-muted'}`
              }>
                  <Icon
                  name={method.icon as any}
                  size={20}
                  className={
                  method.type === 'baridi' ? 'text-blue-600' :
                  method.type === 'whatsapp' ? 'text-green-600' :
                  method.type === 'cash' ? 'text-amber-600' : 'text-primary'
                  } />

                </div>
                <div>
                  <p className="font-medium text-text-primary">{method.name[currentLanguage]}</p>
                  <p className="text-sm text-text-secondary">{method.description[currentLanguage]}</p>
                </div>
              </div>
              {method.type === 'baridi' &&
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Icon name="ShieldCheckIcon" size={16} className="text-success" />
                  <span className="text-xs text-success font-medium">
                    {currentLanguage === 'fr' ? 'Sécurisé' : 'آمن'}
                  </span>
                </div>
            }
            </div>
          </div>
        )}
      </div>

      {renderPaymentForm()}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <Icon name="ShieldCheckIcon" size={20} className="text-success mt-0.5" />
          <div>
            <h4 className="font-medium text-text-primary mb-2">
              {currentLanguage === 'fr' ? 'Paiement Sécurisé' : 'دفع آمن'}
            </h4>
            <p className="text-sm text-text-secondary">
              {currentLanguage === 'fr' ? 'Vos informations de paiement sont protégées par un cryptage SSL 256 bits. Nous ne stockons jamais vos données bancaires.' : 'معلومات الدفع الخاصة بك محمية بتشفير SSL 256 بت. نحن لا نحتفظ أبداً ببياناتك المصرفية.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>);

};

export default PaymentSection;