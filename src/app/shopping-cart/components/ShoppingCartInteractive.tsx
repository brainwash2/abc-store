'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';
import SavedForLater from './SavedForLater';
import CheckoutActions from './CheckoutActions';
import { useCartStore } from '@/store/useCart';

interface SavedItemType {
  id: number;
  name: string;
  nameAr: string;
  image: string;
  alt: string;
  price: number;
  originalPrice?: number;
  brand: string;
  stock: number;
}

const ShoppingCartInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  const [savedItems, setSavedItems] = useState<SavedItemType[]>([]);

  const { items, removeItem, total } = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
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

  const handleQuantityChange = (id: number, quantity: number) => {
    const item = items.find((i) => i.id === String(id));
    if (!item) return;
    if (quantity <= 0) {
      removeItem(item.id);
    } else {
      useCartStore.setState({
        items: items.map((i) => (i.id === item.id ? { ...i, quantity } : i)),
      });
    }
  };

  const handleRemoveItem = (id: number) => removeItem(String(id));

  const handleSaveForLater = (id: number) => {
    const item = items.find((i) => i.id === String(id));
    if (!item) return;
    setSavedItems((prev) => [
      ...prev,
      {
        id: Number(item.id),
        name: item.title,
        nameAr: item.title,
        image: item.image,
        alt: item.title,
        price: item.price,
        brand: item.brand || '',
        stock: 10,
      },
    ]);
    removeItem(item.id);
  };

  const handleMoveToCart = (id: number) => {
    const saved = savedItems.find((s) => s.id === id);
    if (!saved) return;
    useCartStore.getState().addItem({
      id: saved.id.toString(),
      title: saved.name,
      price: saved.price,
      image: saved.image,
      brand: saved.brand,
    });
    setSavedItems((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRemoveSaved = (id: number) => {
    setSavedItems((prev) => prev.filter((s) => s.id !== id));
  };

  const handleProceedToCheckout = () => router.push('/checkout');

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-6"></div>
            <div className="h-32 bg-muted rounded-lg mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = total();
  const shipping = subtotal > 50000 ? 0 : 1500;
  const tax = Math.round(subtotal * 0.19);
  const grandTotal = subtotal + shipping + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={itemCount}
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {currentLanguage === 'fr' ? "Panier d'achat" : 'سلة التسوق'}
            </h1>
            {items.length > 0 && (
              <p className="text-text-secondary">
                {itemCount} {currentLanguage === 'fr' ? 'article(s) dans votre panier' : 'عنصر في سلتك'}
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <EmptyCart currentLanguage={currentLanguage} />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={{
                        id: Number(item.id),
                        name: item.title,
                        nameAr: item.title,
                        image: item.image,
                        alt: item.title,
                        price: item.price,
                        quantity: item.quantity,
                        stock: 10,
                        brand: item.brand || '',
                        model: '',
                        specifications: [],
                        estimatedDelivery: 'Livraison estimée: 2-4 jours ouvrables',
                        estimatedDeliveryAr: 'التسليم المتوقع: 2-4 أيام عمل',
                      }}
                      currentLanguage={currentLanguage}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                      onSaveForLater={handleSaveForLater}
                    />
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <OrderSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    discount={0}
                    total={grandTotal}
                    itemCount={itemCount}
                    currentLanguage={currentLanguage}
                    estimatedDelivery="Livraison estimée: 2-4 jours ouvrables"
                    estimatedDeliveryAr="التسليم المتوقع: 2-4 أيام عمل"
                  />
                </div>
              </div>

              <CheckoutActions
                currentLanguage={currentLanguage}
                total={grandTotal}
                itemCount={itemCount}
                isCartEmpty={false}
                onProceedToCheckout={handleProceedToCheckout}
              />
            </>
          )}

          <SavedForLater
            savedItems={savedItems}
            currentLanguage={currentLanguage}
            onMoveToCart={handleMoveToCart}
            onRemove={handleRemoveSaved}
          />
        </div>
      </main>
    </div>
  );
};

export default ShoppingCartInteractive;
