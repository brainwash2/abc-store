'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/common/Header';
import CheckoutProgress from './CheckoutProgress';
import DeliverySection from './DeliverySection';
import PaymentSection from './PaymentSection';
import OrderSummary from './OrderSummary';
import { supabase } from '@/lib/supabase'; // Import Supabase

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  specifications: string;
}

const CheckoutInteractive = () => {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(1);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string | null>('standard');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string;}>({});

  // Mock cart data (Ideally this comes from your Cart Store)
  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "Ordinateur Portable ASUS VivoBook 15",
      price: 89000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1666926785795-936c30b52bb0",
      alt: "Silver ASUS VivoBook laptop",
      specifications: "Intel Core i5, 8GB RAM, 512GB SSD"
    },
    {
      id: 2,
      name: "Souris Gaming Logitech G502",
      price: 8500,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1564718944129-22ad7478b856",
      alt: "Black gaming mouse",
      specifications: "RGB, 25600 DPI"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice = selectedDeliveryMethod === 'standard' ? 500 : selectedDeliveryMethod === 'express' ? 1200 : 0;
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + deliveryPrice + tax;

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'fr' | 'ar' || 'fr';
    setCurrentLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;
  }, []);

  const handleLanguageChange = (language: 'fr' | 'ar') => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  const handleAddressSelect = (id: number) => { setSelectedAddress(id); setErrors({ ...errors, address: '' }); };
  const handleDeliveryMethodSelect = (id: string) => { setSelectedDeliveryMethod(id); setErrors({ ...errors, delivery: '' }); };
  const handlePaymentMethodSelect = (id: string) => { setSelectedPaymentMethod(id); setErrors({ ...errors, payment: '' }); };
  const handleToggleNewAddressForm = () => setShowNewAddressForm(!showNewAddressForm);

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string;} = {};
    if (step === 1) {
      if (!selectedAddress) newErrors.address = currentLanguage === 'fr' ? 'Veuillez sélectionner une adresse' : 'يرجى اختيار عنوان';
      if (!selectedDeliveryMethod) newErrors.delivery = currentLanguage === 'fr' ? 'Veuillez sélectionner un mode de livraison' : 'يرجى اختيار طريقة التوصيل';
    } else if (step === 2) {
      if (!selectedPaymentMethod) newErrors.payment = currentLanguage === 'fr' ? 'Veuillez sélectionner un mode de paiement' : 'يرجى اختيار طريقة الدفع';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => { if (validateStep(currentStep) && currentStep < 3) setCurrentStep(currentStep + 1); };
  const handlePreviousStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  // --- THE FIXED DB LOGIC ---
  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;
    setIsProcessing(true);

    try {
      // 1. Get the current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();

      // 2. Insert into Database
      const { data: order, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: user?.user_metadata?.full_name || "Client Web",
            customer_phone: "0550 12 34 56",
            wilaya: "Alger",
            address: "15 Rue Didouche Mourad",
            total_amount: total,
            payment_method: selectedPaymentMethod,
            status: 'pending',
            user_id: user?.id || null // Link to user if exists, otherwise null
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 3. Handle WhatsApp Redirect
      if (selectedPaymentMethod === 'whatsapp') {
        const message = encodeURIComponent(`Bonjour ABC, Commande #${order.id.slice(0,8)} confirmée.`);
        window.open(`https://wa.me/213555123456?text=${message}`, '_blank');
      }

      // 4. Success Redirect
      router.push(`/order-details?order_id=${order.id}&status=success`);

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
        cartItemCount={3}
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
                  selectedAddress={selectedAddress}
                  selectedDeliveryMethod={selectedDeliveryMethod}
                  showNewAddressForm={showNewAddressForm}
                  onAddressSelect={handleAddressSelect}
                  onDeliveryMethodSelect={handleDeliveryMethodSelect}
                  onToggleNewAddressForm={handleToggleNewAddressForm} 
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
                cartItems={cartItems}
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
};

export default CheckoutInteractive;