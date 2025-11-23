import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface CheckoutProgressProps {
  currentStep: number;
  currentLanguage: 'fr' | 'ar';
}

const CheckoutProgress = ({ currentStep, currentLanguage }: CheckoutProgressProps) => {
  const steps = [
    {
      id: 1,
      label: { fr: 'Livraison', ar: 'التوصيل' },
      icon: 'TruckIcon'
    },
    {
      id: 2,
      label: { fr: 'Paiement', ar: 'الدفع' },
      icon: 'CreditCardIcon'
    },
    {
      id: 3,
      label: { fr: 'Confirmation', ar: 'التأكيد' },
      icon: 'CheckCircleIcon'
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 mb-6 shadow-elevation-1">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth ${
                currentStep >= step.id
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-muted border-border text-text-secondary'
              }`}>
                {currentStep > step.id ? (
                  <Icon name="CheckIcon" size={20} />
                ) : (
                  <Icon name={step.icon as any} size={20} />
                )}
              </div>
              <div className={`ml-3 rtl:ml-0 rtl:mr-3 ${currentStep >= step.id ? 'text-primary' : 'text-text-secondary'}`}>
                <p className="text-sm font-medium">{step.label[currentLanguage]}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-primary' : 'bg-border'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;