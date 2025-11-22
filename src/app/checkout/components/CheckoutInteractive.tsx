'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/common/Header';
import CheckoutProgress from './CheckoutProgress';
import DeliverySection from './DeliverySection';
import PaymentSection from './PaymentSection';
import OrderSummary from './OrderSummary';

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

  // Mock cart data
  const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Ordinateur Portable ASUS VivoBook 15",
    price: 89000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1666926785795-936c30b52bb0",
    alt: "Silver ASUS VivoBook laptop open on white desk showing screen",
    specifications: "Intel Core i5, 8GB RAM, 512GB SSD"
  },
  {
    id: 2,
    name: "Souris Gaming Logitech G502",
    price: 8500,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1564718944129-22ad7478b856",
    alt: "Black gaming mouse with RGB lighting on dark surface",
    specifications: "RGB, 25600 DPI, 11 boutons programmables"
  }];


  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice = selectedDeliveryMethod === 'standard' ? 500 :
  selectedDeliveryMethod === 'express' ? 1200 : 0;
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + deliveryPrice + tax;

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') as 'fr' | 'ar' || 'fr';
    setCurrentLanguage(savedLanguage);

    // Apply RTL/LTR direction
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;
  }, []);

  const handleLanguageChange = (language: 'fr' | 'ar') => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  const handleAddressSelect = (id: number) => {
    setSelectedAddress(id);
    setErrors({ ...errors, address: '' });
  };

  const handleDeliveryMethodSelect = (id: string) => {
    setSelectedDeliveryMethod(id);
    setErrors({ ...errors, delivery: '' });
  };

  const handlePaymentMethodSelect = (id: string) => {
    setSelectedPaymentMethod(id);
    setErrors({ ...errors, payment: '' });
  };

  const handleToggleNewAddressForm = () => {
    setShowNewAddressForm(!showNewAddressForm);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string;} = {};

    if (step === 1) {
      if (!selectedAddress) {
        newErrors.address = currentLanguage === 'fr' ? 'Veuillez sélectionner une adresse de livraison' : 'يرجى اختيار عنوان التوصيل';
      }
      if (!selectedDeliveryMethod) {
        newErrors.delivery = currentLanguage === 'fr' ? 'Veuillez sélectionner un mode de livraison' : 'يرجى اختيار طريقة التوصيل';
      }
    } else if (step === 2) {
      if (!selectedPaymentMethod) {
        newErrors.payment = currentLanguage === 'fr' ? 'Veuillez sélectionner un mode de paiement' : 'يرجى اختيار طريقة الدفع';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (selectedPaymentMethod === 'baridi_mob') {
        // Redirect to Baridi Mob payment gateway
        window.location.href = 'https://payment.baridi-mob.dz/checkout?order_id=ABC123456';
      } else if (selectedPaymentMethod === 'whatsapp') {
        // Generate WhatsApp message
        const orderDetails = cartItems.map((item) =>
        `${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} DA`
        ).join('\n');

        const message = encodeURIComponent(
          `Bonjour ABC Informatique,\n\nJe souhaite passer commande:\n\n${orderDetails}\n\nTotal: ${total.toLocaleString()} DA\n\nMerci!`
        );

        window.open(`https://wa.me/213555123456?text=${message}`, '_blank');
      } else {
        // Cash on delivery - redirect to order confirmation
        router.push('/order-details?order_id=ABC123456');
      }
    } catch (error) {
      console.error('Order processing error:', error);
      setErrors({
        general: currentLanguage === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : 'حدث خطأ. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCartClick = () => {
    router.push('/shopping-cart');
  };

  const handleAccountClick = () => {

    // Handle account menu
  };
  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onCartClick={handleCartClick}
        onAccountClick={handleAccountClick} />


      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-text-secondary mb-4">
              <button
                onClick={() => router.push('/shopping-cart')}
                className="hover:text-primary transition-smooth">

                {currentLanguage === 'fr' ? 'Panier' : 'السلة'}
              </button>
              <Icon name="ChevronRightIcon" size={16} className="rtl:rotate-180" />
              <span className="text-text-primary">
                {currentLanguage === 'fr' ? 'Commande' : 'الطلب'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary">
              {currentLanguage === 'fr' ? 'Finaliser la Commande' : 'إتمام الطلب'}
            </h1>
            <p className="text-text-secondary mt-2">
              {currentLanguage === 'fr' ? 'Vérifiez vos informations et finalisez votre achat en toute sécurité' : 'تحقق من معلوماتك وأتمم عملية الشراء بأمان'
              }
            </p>
          </div>

          {/* Progress Indicator */}
          <CheckoutProgress currentStep={currentStep} currentLanguage={currentLanguage} />

          {/* Error Messages */}
          {Object.keys(errors).length > 0 &&
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <Icon name="ExclamationTriangleIcon" size={20} className="text-error mt-0.5" />
                <div>
                  <h4 className="font-medium text-error mb-1">
                    {currentLanguage === 'fr' ? 'Erreurs détectées:' : 'أخطاء مكتشفة:'}
                  </h4>
                  <ul className="text-sm text-error space-y-1">
                    {Object.values(errors).map((error, index) =>
                  <li key={index}>• {error}</li>
                  )}
                  </ul>
                </div>
              </div>
            </div>
          }

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Delivery Information */}
              {currentStep >= 1 &&
              <DeliverySection
                currentLanguage={currentLanguage}
                selectedAddress={selectedAddress}
                selectedDeliveryMethod={selectedDeliveryMethod}
                showNewAddressForm={showNewAddressForm}
                onAddressSelect={handleAddressSelect}
                onDeliveryMethodSelect={handleDeliveryMethodSelect}
                onToggleNewAddressForm={handleToggleNewAddressForm} />

              }

              {/* Step 2: Payment Information */}
              {currentStep >= 2 &&
              <PaymentSection
                currentLanguage={currentLanguage}
                selectedPaymentMethod={selectedPaymentMethod}
                onPaymentMethodSelect={handlePaymentMethodSelect} />

              }

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 text-text-secondary hover:text-primary transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">

                  <Icon name="ChevronLeftIcon" size={20} className="rtl:rotate-180" />
                  <span>{currentLanguage === 'fr' ? 'Précédent' : 'السابق'}</span>
                </button>

                {currentStep < 2 ?
                <button
                  onClick={handleNextStep}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-smooth font-medium">

                    <span>{currentLanguage === 'fr' ? 'Continuer' : 'متابعة'}</span>
                    <Icon name="ChevronRightIcon" size={20} className="rtl:rotate-180" />
                  </button> :

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-success text-success-foreground px-8 py-3 rounded-lg hover:bg-success/90 transition-smooth font-medium disabled:opacity-50 disabled:cursor-not-allowed">

                    {isProcessing ?
                  <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>
                          {currentLanguage === 'fr' ? 'Traitement...' : 'جاري المعالجة...'}
                        </span>
                      </> :

                  <>
                        <Icon name="CheckIcon" size={20} />
                        <span>
                          {currentLanguage === 'fr' ? 'Confirmer la Commande' : 'تأكيد الطلب'}
                        </span>
                      </>
                  }
                  </button>
                }
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                currentLanguage={currentLanguage}
                cartItems={cartItems}
                deliveryPrice={deliveryPrice}
                subtotal={subtotal}
                total={total} />

            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default CheckoutInteractive;