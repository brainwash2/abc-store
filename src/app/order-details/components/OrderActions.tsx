'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface OrderActionsProps {
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  canModify: boolean;
  canCancel: boolean;
  canReturn: boolean;
  currentLanguage: 'fr' | 'ar';
}

const OrderActions = ({ 
  orderStatus, 
  canModify, 
  canCancel, 
  canReturn, 
  currentLanguage 
}: OrderActionsProps) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const handleModifyOrder = () => {
    // Handle order modification
    console.log('Modify order clicked');
  };

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const handleReturnOrder = () => {
    setShowReturnModal(true);
  };

  const handleContactSupport = () => {
    // Handle contact support
    console.log('Contact support clicked');
  };

  const confirmCancel = () => {
    // Handle cancel confirmation
    console.log('Order cancelled');
    setShowCancelModal(false);
  };

  const confirmReturn = () => {
    // Handle return confirmation
    console.log('Return requested');
    setShowReturnModal(false);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          {currentLanguage === 'fr' ? 'Actions disponibles' : 'الإجراءات المتاحة'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Modify Order */}
          {canModify && (
            <button
              onClick={handleModifyOrder}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="PencilIcon" size={16} />
              {currentLanguage === 'fr' ? 'Modifier' : 'تعديل'}
            </button>
          )}

          {/* Cancel Order */}
          {canCancel && (
            <button
              onClick={handleCancelOrder}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-error text-error-foreground rounded-lg hover:bg-error/90 transition-smooth"
            >
              <Icon name="XMarkIcon" size={16} />
              {currentLanguage === 'fr' ? 'Annuler' : 'إلغاء'}
            </button>
          )}

          {/* Return Order */}
          {canReturn && (
            <button
              onClick={handleReturnOrder}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-warning text-warning-foreground rounded-lg hover:bg-warning/90 transition-smooth"
            >
              <Icon name="ArrowUturnLeftIcon" size={16} />
              {currentLanguage === 'fr' ? 'Retourner' : 'إرجاع'}
            </button>
          )}

          {/* Contact Support */}
          <button
            onClick={handleContactSupport}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-smooth"
          >
            <Icon name="ChatBubbleLeftEllipsisIcon" size={16} />
            {currentLanguage === 'fr' ? 'Support' : 'الدعم'}
          </button>
        </div>

        {/* Return Policy Info */}
        {orderStatus === 'delivered' && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-text-primary mb-1">
                  {currentLanguage === 'fr' ? 'Politique de retour' : 'سياسة الإرجاع'}
                </p>
                <p className="text-text-secondary">
                  {currentLanguage === 'fr' ?'Vous avez 14 jours pour retourner vos produits. Les articles doivent être dans leur état d\'origine avec l\'emballage.' :'لديك 14 يومًا لإرجاع منتجاتك. يجب أن تكون العناصر في حالتها الأصلية مع التغليف.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {currentLanguage === 'fr' ? 'Confirmer l\'annulation' : 'تأكيد الإلغاء'}
            </h3>
            <p className="text-text-secondary mb-6">
              {currentLanguage === 'fr' ?'Êtes-vous sûr de vouloir annuler cette commande? Cette action ne peut pas être annulée.' :'هل أنت متأكد من أنك تريد إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-smooth"
              >
                {currentLanguage === 'fr' ? 'Annuler' : 'إلغاء'}
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-4 py-2 bg-error text-error-foreground rounded-lg hover:bg-error/90 transition-smooth"
              >
                {currentLanguage === 'fr' ? 'Confirmer' : 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Confirmation Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {currentLanguage === 'fr' ? 'Demande de retour' : 'طلب الإرجاع'}
            </h3>
            <p className="text-text-secondary mb-6">
              {currentLanguage === 'fr' ?'Voulez-vous initier une demande de retour pour cette commande?' :'هل تريد بدء طلب إرجاع لهذا الطلب؟'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-smooth"
              >
                {currentLanguage === 'fr' ? 'Annuler' : 'إلغاء'}
              </button>
              <button
                onClick={confirmReturn}
                className="flex-1 px-4 py-2 bg-warning text-warning-foreground rounded-lg hover:bg-warning/90 transition-smooth"
              >
                {currentLanguage === 'fr' ? 'Confirmer' : 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderActions;