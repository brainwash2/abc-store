'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import OrderHeader from './OrderHeader';
import ProductList from './ProductList';
import DeliveryInfo from './DeliveryInfo';
import PaymentSummary from './PaymentSummary';
import OrderTimeline from './OrderTimeline';
import OrderActions from './OrderActions';

interface Product {
  id: string;
  name: string;
  image: string;
  alt: string;
  quantity: number;
  price: number;
  specifications: string[];
  category: string;
}

interface DeliveryAddress {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface PaymentDetails {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

interface TimelineEvent {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
}

const OrderDetailsInteractive = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedLanguage = localStorage.getItem('language') as 'fr' | 'ar';
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const handleLanguageChange = (language: 'fr' | 'ar') => {
    setCurrentLanguage(language);
    if (isHydrated) {
      localStorage.setItem('language', language);
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  };

  // Mock order data
  const orderData = {
    orderNumber: "ORD-2024-001234",
    orderDate: "15/11/2024",
    // FIX: Explicitly tell TypeScript this can be any status, not just 'shipped'
    status: 'shipped' as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    estimatedDelivery: "18/11/2024",

    products: [
    {
      id: "1",
      name: "Ordinateur Portable ASUS VivoBook 15",
      image: "https://images.unsplash.com/photo-1666926785795-936c30b52bb0",
      alt: "Modern silver ASUS VivoBook laptop with black keyboard on white background",
      quantity: 1,
      price: 89000,
      specifications: ["Intel Core i5", "8GB RAM", "512GB SSD", "15.6\" FHD"],
      category: "Ordinateurs Portables"
    },
    {
      id: "2",
      name: "Souris Gaming Logitech G502",
      image: "https://images.unsplash.com/photo-1598569666598-49f7bbde8cba",
      alt: "Black Logitech gaming mouse with RGB lighting on dark surface",
      quantity: 1,
      price: 8500,
      specifications: ["RGB", "11 boutons", "25600 DPI", "Filaire"],
      category: "Accessoires"
    }] as Product[],

    deliveryAddress: {
      name: "Ahmed Benali",
      street: "123 Rue Didouche Mourad",
      city: "Alger",
      postalCode: "16000",
      phone: "+213 555 123 456"
    } as DeliveryAddress,

    deliveryMethod: "Livraison Standard",
    trackingNumber: "DZ2024111500123",
    carrier: "Algérie Poste",
    trackingStatus: "En transit vers Alger",

    payment: {
      subtotal: 97500,
      shipping: 0,
      tax: 18525,
      discount: 5000,
      total: 111025,
      paymentMethod: "Baridi Mob",
      paymentStatus: 'paid' as const
    } as PaymentDetails,

    timeline: [
    {
      id: "1",
      status: currentLanguage === 'fr' ? "Commande confirmée" : "تم تأكيد الطلب",
      description: currentLanguage === 'fr' ?
      "Votre commande a été confirmée et le paiement a été traité avec succès." : "تم تأكيد طلبك ومعالجة الدفع بنجاح.",
      timestamp: "15/11/2024 14:30",
      isCompleted: true
    },
    {
      id: "2",
      status: currentLanguage === 'fr' ? "En préparation" : "قيد التحضير",
      description: currentLanguage === 'fr' ?
      "Vos articles sont en cours de préparation dans notre entrepôt." : "يتم تحضير عناصرك في مستودعنا.",
      timestamp: "15/11/2024 16:45",
      isCompleted: true
    },
    {
      id: "3",
      status: currentLanguage === 'fr' ? "Expédiée" : "تم الشحن",
      description: currentLanguage === 'fr' ?
      "Votre commande a été expédiée et est en route vers votre adresse." : "تم شحن طلبك وهو في طريقه إلى عنوانك.",
      timestamp: "16/11/2024 09:15",
      isCompleted: true
    },
    {
      id: "4",
      status: currentLanguage === 'fr' ? "En transit" : "في الطريق",
      description: currentLanguage === 'fr' ?
      "Votre colis est actuellement en transit vers Alger." : "طردك في الطريق حاليًا إلى الجزائر.",
      timestamp: "16/11/2024 18:20",
      isCompleted: true
    },
    {
      id: "5",
      status: currentLanguage === 'fr' ? "Livraison prévue" : "التسليم المتوقع",
      description: currentLanguage === 'fr' ?
      "Livraison prévue le 18/11/2024 entre 09:00 et 17:00." : "التسليم المتوقع في 18/11/2024 بين 09:00 و 17:00.",
      timestamp: "18/11/2024 (Estimé)",
      isCompleted: false
    }] as TimelineEvent[]
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-muted rounded-lg"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-muted rounded-lg"></div>
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={2}
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange} />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Order Header */}
            <OrderHeader
              orderNumber={orderData.orderNumber}
              orderDate={orderData.orderDate}
              status={orderData.status}
              estimatedDelivery={orderData.estimatedDelivery}
              currentLanguage={currentLanguage} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                <ProductList
                  products={orderData.products}
                  currentLanguage={currentLanguage} />
                
                <DeliveryInfo
                  address={orderData.deliveryAddress}
                  deliveryMethod={orderData.deliveryMethod}
                  trackingNumber={orderData.trackingNumber}
                  carrier={orderData.carrier}
                  trackingStatus={orderData.trackingStatus}
                  currentLanguage={currentLanguage} />
                
                <OrderTimeline
                  events={orderData.timeline}
                  currentLanguage={currentLanguage} />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <PaymentSummary
                  payment={orderData.payment}
                  currentLanguage={currentLanguage} />
                
                <OrderActions
                  orderStatus={orderData.status}
                  canModify={false}
                  canCancel={false}
                  canReturn={orderData.status === 'delivered'}
                  currentLanguage={currentLanguage} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>);
};

export default OrderDetailsInteractive;