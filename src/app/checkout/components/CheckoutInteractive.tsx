'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/common/Header';
import CheckoutProgress from './CheckoutProgress';
import DeliverySection from './DeliverySection';
import PaymentSection from './PaymentSection';
import OrderSummary from './OrderSummary';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/useCart';

export default function CheckoutInteractive() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string | null>('standard');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice = selectedDeliveryMethod === 'standard' ? 500 : selectedDeliveryMethod === 'express' ? 1200 : 0;
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + deliveryPrice + tax;

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'fr' | 'ar' || 'fr';
    setCurrentLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setAddresses(data);
      if (data.length > 0 && !selectedAddressId) {
        const defaultAddr = data.find(a => a.is_default) || data[0];
        setSelectedAddressId(defaultAddr.id);
      }
    }
  };

  const handleLanguageChange = (language: 'fr' | 'ar') => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    setErrors(prev => ({ ...prev, address: '' }));
  };

  const handleDeliveryMethodSelect = (id: string) => {
    setSelectedDeliveryMethod(id);
    setErrors(prev => ({ ...prev, delivery: '' }));
  };

  const handlePaymentMethodSelect = (id: string) => {
    setSelectedPaymentMethod(id);
    setErrors(prev => ({ ...prev, payment: '' }));
  };

  const handleToggleNewAddressForm = () => setShowNewAddressForm(prev => !prev);

  const handleNewAddressSaved = async () => {
    await fetchAddresses();
    setShowNewAddressForm(false);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (step === 1) {
      if (!selectedAddressId) newErrors.address = currentLanguage === 'fr' ? 'Veuillez sélectionner une adresse' : 'يرجى اختيار عنوان';
      if (!selectedDeliveryMethod) newErrors.delivery = currentLanguage === 'fr' ? 'Veuillez sélectionner un mode de livraison' : 'يرجى اختيار طريقة التوصيل';
    } else if (step === 2) {
      if (!selectedPaymentMethod) newErrors.payment = currentLanguage === 'fr' ? 'Veuillez sélectionner un mode de paiement' : 'يرجى اختيار طريقة الدفع';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep) && currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;
    setIsProcessing(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          })),
          addressId: selectedAddressId,
          deliveryMethod: selectedDeliveryMethod,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      clearCart();
      router.push(`/order-details?order_id=${data.orderId}&status=success`);
    } catch (error: any) {
      console.error('Order Error:', error);
      alert(`Erreur: ${error.message || "Impossible de commander"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCartClick = () => router.push('/shopping-cart');
  const handleAccountClick = () => {};

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={items.length}
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onCartClick={handleCartClick}
        onAccountClick={handleAccountClick}
      />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">
              {currentLanguage === 'fr' ? 'Finaliser la Commande' : 'إتمام الطلب'}
            </h1>
          </div>

          <CheckoutProgress currentStep={currentStep} currentLanguage={currentLanguage} />

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
              {Object.values(errors).map((e, i) => <div key={i}>• {e}</div>)}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {currentStep >= 1 && (
                <DeliverySection
                  currentLanguage={currentLanguage}
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  selectedDeliveryMethod={selectedDeliveryMethod}
                  showNewAddressForm={showNewAddressForm}
                  onAddressSelect={handleAddressSelect}
                  onDeliveryMethodSelect={handleDeliveryMethodSelect}
                  onToggleNewAddressForm={handleToggleNewAddressForm}
                  onNewAddressSaved={handleNewAddressSaved}
                />
              )}

              {currentStep >= 2 && (
                <PaymentSection
                  currentLanguage={currentLanguage}
                  selectedPaymentMethod={selectedPaymentMethod}
                  onPaymentMethodSelect={handlePaymentMethodSelect}
                />
              )}

              <div className="flex items-center justify-between pt-6">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 text-text-secondary hover:text-primary disabled:opacity-50">
                  {currentLanguage === 'fr' ? 'Précédent' : 'السابق'}
                </button>

                {currentStep < 2 ? (
                  <button
                    onClick={handleNextStep}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-smooth font-medium">
                    <span>{currentLanguage === 'fr' ? 'Continuer' : 'متابعة'}</span>
                    <Icon name="ChevronRightIcon" size={20} className="rtl:rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-success text-success-foreground px-8 py-3 rounded-lg hover:bg-success/90 transition-smooth font-medium disabled:opacity-50 flex items-center gap-2">
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{currentLanguage === 'fr' ? 'Traitement...' : 'جاري المعالجة...'}</span>
                      </>
                    ) : (
                      <>
                        <Icon name="CheckIcon" size={20} />
                        <span>{currentLanguage === 'fr' ? 'Confirmer' : 'تأكيد'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                currentLanguage={currentLanguage}
                cartItems={items as any}
                deliveryPrice={deliveryPrice}
                subtotal={subtotal}
                total={total}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
