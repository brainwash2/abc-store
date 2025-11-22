'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';
import SavedForLater from './SavedForLater';
import CheckoutActions from './CheckoutActions';

interface CartItemType {
  id: number;
  name: string;
  nameAr: string;
  image: string;
  alt: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  stock: number;
  brand: string;
  model: string;
  specifications: string[];
  estimatedDelivery: string;
  estimatedDeliveryAr: string;
}

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
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItemType[]>([]);

  useEffect(() => {
    setIsHydrated(true);

    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'fr' | 'ar' || 'fr';
    setCurrentLanguage(savedLanguage);

    // Apply RTL/LTR direction
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;

    // Load mock cart data
    const mockCartItems: CartItemType[] = [
    {
      id: 1,
      name: "Ordinateur Portable HP Pavilion 15",
      nameAr: "لابتوب HP Pavilion 15",
      image: "https://images.unsplash.com/photo-1637329336542-10af4a6ca083",
      alt: "Modern silver HP Pavilion laptop open on white desk showing colorful desktop wallpaper",
      price: 89999,
      originalPrice: 99999,
      quantity: 1,
      stock: 15,
      brand: "HP",
      model: "Pavilion 15-eh1xxx",
      specifications: ["AMD Ryzen 5", "8GB RAM", "256GB SSD", "15.6\" FHD"],
      estimatedDelivery: "Livraison estimée: 2-3 jours ouvrables",
      estimatedDeliveryAr: "التسليم المتوقع: 2-3 أيام عمل"
    },
    {
      id: 2,
      name: "Souris Gaming Logitech G502 HERO",
      nameAr: "فأرة الألعاب Logitech G502 HERO",
      image: "https://images.unsplash.com/photo-1598569666598-49f7bbde8cba",
      alt: "Black Logitech gaming mouse with RGB lighting and ergonomic design on dark surface",
      price: 8999,
      quantity: 2,
      stock: 25,
      brand: "Logitech",
      model: "G502 HERO",
      specifications: ["25K DPI", "11 boutons", "RGB LIGHTSYNC", "Poids ajustable"],
      estimatedDelivery: "Livraison estimée: 1-2 jours ouvrables",
      estimatedDeliveryAr: "التسليم المتوقع: 1-2 أيام عمل"
    },
    {
      id: 3,
      name: "Clavier Mécanique Corsair K95 RGB",
      nameAr: "لوحة مفاتيح ميكانيكية Corsair K95 RGB",
      image: "https://images.unsplash.com/photo-1643295054171-faf3f2491ecb",
      alt: "Black mechanical gaming keyboard with RGB backlighting and macro keys on wooden desk",
      price: 15999,
      originalPrice: 17999,
      quantity: 1,
      stock: 8,
      brand: "Corsair",
      model: "K95 RGB PLATINUM XT",
      specifications: ["Cherry MX Speed", "RGB Per-Key", "6 Macros", "Repose-poignet"],
      estimatedDelivery: "Livraison estimée: 2-3 jours ouvrables",
      estimatedDeliveryAr: "التسليم المتوقع: 2-3 أيام عمل"
    }];


    const mockSavedItems: SavedItemType[] = [
    {
      id: 4,
      name: "Écran Gaming ASUS ROG 27\"",
      nameAr: "شاشة الألعاب ASUS ROG 27 بوصة",
      image: "https://images.unsplash.com/photo-1651012998667-2c779fee76f8",
      alt: "Large curved gaming monitor displaying colorful game graphics on modern desk setup",
      price: 45999,
      originalPrice: 49999,
      brand: "ASUS",
      stock: 12
    },
    {
      id: 5,
      name: "Casque Gaming SteelSeries Arctis 7",
      nameAr: "سماعة الألعاب SteelSeries Arctis 7",
      image: "https://images.unsplash.com/photo-1636487658544-7704a1fad45e",
      alt: "Black wireless gaming headset with microphone on white background",
      price: 18999,
      brand: "SteelSeries",
      stock: 0
    }];


    setCartItems(mockCartItems);
    setSavedItems(mockSavedItems);
  }, []);

  const handleLanguageChange = (language: 'fr' | 'ar') => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems((items) =>
    items.map((item) =>
    item.id === id ? { ...item, quantity } : item
    )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleSaveForLater = (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const savedItem: SavedItemType = {
        id: item.id,
        name: item.name,
        nameAr: item.nameAr,
        image: item.image,
        alt: item.alt,
        price: item.price,
        originalPrice: item.originalPrice,
        brand: item.brand,
        stock: item.stock
      };

      setSavedItems((items) => [...items, savedItem]);
      setCartItems((items) => items.filter((item) => item.id !== id));
    }
  };

  const handleMoveToCart = (id: number) => {
    const savedItem = savedItems.find((item) => item.id === id);
    if (savedItem && savedItem.stock > 0) {
      const cartItem: CartItemType = {
        ...savedItem,
        quantity: 1,
        model: "Model Standard",
        specifications: ["Spécifications standard"],
        estimatedDelivery: "Livraison estimée: 2-3 jours ouvrables",
        estimatedDeliveryAr: "التسليم المتوقع: 2-3 أيام عمل"
      };

      setCartItems((items) => [...items, cartItem]);
      setSavedItems((items) => items.filter((item) => item.id !== id));
    }
  };

  const handleRemoveSaved = (id: number) => {
    setSavedItems((items) => items.filter((item) => item.id !== id));
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  const handleCartClick = () => {

    // Already on cart page
  };
  const handleAccountClick = () => {

    // Handle account menu
  };
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {[1, 2, 3].map((i) =>
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                  )}
                </div>
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>);

  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 1500; // Free shipping over 500 DZD
  const tax = Math.round(subtotal * 0.19); // 19% VAT
  const discount = cartItems.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const total = subtotal + shipping + tax - discount;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={itemCount}
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onCartClick={handleCartClick}
        onAccountClick={handleAccountClick} />


      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {currentLanguage === 'fr' ? 'Panier d\'achat' : 'سلة التسوق'}
            </h1>
            {!isCartEmpty &&
            <p className="text-text-secondary">
                {itemCount} {currentLanguage === 'fr' ? 'article(s) dans votre panier' : 'عنصر في سلتك'}
              </p>
            }
          </div>

          {isCartEmpty ?
          <EmptyCart currentLanguage={currentLanguage} /> :

          <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {cartItems.map((item) =>
                  <CartItem
                    key={item.id}
                    item={item}
                    currentLanguage={currentLanguage}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    onSaveForLater={handleSaveForLater} />

                  )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  discount={discount}
                  total={total}
                  itemCount={itemCount}
                  currentLanguage={currentLanguage}
                  estimatedDelivery="Livraison estimée: 2-4 jours ouvrables"
                  estimatedDeliveryAr="التسليم المتوقع: 2-4 أيام عمل" />

                </div>
              </div>

              {/* Checkout Actions */}
              <CheckoutActions
              currentLanguage={currentLanguage}
              total={total}
              itemCount={itemCount}
              isCartEmpty={isCartEmpty}
              onProceedToCheckout={handleProceedToCheckout} />

            </>
          }

          {/* Saved for Later */}
          <SavedForLater
            savedItems={savedItems}
            currentLanguage={currentLanguage}
            onMoveToCart={handleMoveToCart}
            onRemove={handleRemoveSaved} />

        </div>
      </main>
    </div>);

};

export default ShoppingCartInteractive;