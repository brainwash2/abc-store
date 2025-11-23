import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface OrderHeaderProps {
  orderNumber: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  currentLanguage: 'fr' | 'ar';
}

const OrderHeader = ({ 
  orderNumber, 
  orderDate, 
  status, 
  estimatedDelivery, 
  currentLanguage 
}: OrderHeaderProps) => {
  const statusConfig = {
    pending: {
      color: 'bg-warning text-warning-foreground',
      icon: 'ClockIcon',
      label: { fr: 'En attente', ar: 'في الانتظار' }
    },
    confirmed: {
      color: 'bg-primary text-primary-foreground',
      icon: 'CheckCircleIcon',
      label: { fr: 'Confirmée', ar: 'مؤكدة' }
    },
    processing: {
      color: 'bg-accent text-accent-foreground',
      icon: 'CogIcon',
      label: { fr: 'En traitement', ar: 'قيد المعالجة' }
    },
    shipped: {
      color: 'bg-secondary text-secondary-foreground',
      icon: 'TruckIcon',
      label: { fr: 'Expédiée', ar: 'مشحونة' }
    },
    delivered: {
      color: 'bg-success text-success-foreground',
      icon: 'CheckBadgeIcon',
      label: { fr: 'Livrée', ar: 'تم التسليم' }
    },
    cancelled: {
      color: 'bg-error text-error-foreground',
      icon: 'XCircleIcon',
      label: { fr: 'Annulée', ar: 'ملغية' }
    }
  };

  const currentStatus = statusConfig[status];

  const progressSteps = [
    { key: 'confirmed', label: { fr: 'Confirmée', ar: 'مؤكدة' } },
    { key: 'processing', label: { fr: 'Traitement', ar: 'المعالجة' } },
    { key: 'shipped', label: { fr: 'Expédiée', ar: 'مشحونة' } },
    { key: 'delivered', label: { fr: 'Livrée', ar: 'تم التسليم' } }
  ];

  const getStepStatus = (stepKey: string) => {
    const stepOrder = ['confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = stepOrder.indexOf(status);
    const stepIndex = stepOrder.indexOf(stepKey);
    
    if (status === 'cancelled') return 'cancelled';
    if (stepIndex <= currentIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Order Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h1 className="text-2xl font-semibold text-text-primary">
              {currentLanguage === 'fr' ? 'Commande' : 'الطلب'} #{orderNumber}
            </h1>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
              <Icon name={currentStatus.icon as any} size={16} />
              {currentStatus.label[currentLanguage]}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">
                {currentLanguage === 'fr' ? 'Date de commande:' : 'تاريخ الطلب:'}
              </span>
              <p className="font-medium text-text-primary">{orderDate}</p>
            </div>
            <div>
              <span className="text-text-secondary">
                {currentLanguage === 'fr' ? 'Livraison estimée:' : 'التسليم المتوقع:'}
              </span>
              <p className="font-medium text-text-primary">{estimatedDelivery}</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {status !== 'cancelled' && (
          <div className="lg:w-96">
            <div className="flex items-center justify-between mb-2">
              {progressSteps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-smooth ${
                    getStepStatus(step.key) === 'completed' 
                      ? 'bg-success text-success-foreground' :'bg-muted text-muted-foreground'
                  }`}>
                    {getStepStatus(step.key) === 'completed' ? (
                      <Icon name="CheckIcon" size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs text-text-secondary mt-1 text-center">
                    {step.label[currentLanguage]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              {progressSteps.map((step, index) => (
                <React.Fragment key={step.key}>
                  {index > 0 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-smooth ${
                      getStepStatus(step.key) === 'completed' ? 'bg-success' : 'bg-muted'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHeader;