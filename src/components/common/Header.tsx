'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import CartSheet from '@/components/layout/CartSheet'; // Import the Sheet
import { useCartStore } from '@/store/useCart';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  cartItemCount?: number;
  isAuthenticated?: boolean;
  currentLanguage?: 'fr' | 'ar';
  onLanguageChange?: (language: 'fr' | 'ar') => void;
  onCartClick?: () => void;
  onAccountClick?: () => void;
}

const Header = ({ 
  isAuthenticated = true, // Assuming true for now
  currentLanguage = 'fr',
  onLanguageChange
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  
  // Connect to Real Store
  const cartItems = useCartStore((state) => state.items);
  const realCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: { fr: 'Accueil', ar: 'الرئيسية' }, href: '/homepage', icon: 'HomeIcon' },
    { label: { fr: 'Produits', ar: 'المنتجات' }, href: '/product-catalog', icon: 'CubeIcon' },
    // Removed Cart from nav items because it's a dedicated button
    { label: { fr: 'Commandes', ar: 'الطلبات' }, href: '/user/orders', icon: 'ClipboardDocumentListIcon' }
  ];

  // UPDATED LINKS: Pointing to the real pages we built
  const accountMenuItems = [
    { label: { fr: 'Mon Profil', ar: 'ملفي الشخصي' }, href: '/user/dashboard', icon: 'UserIcon' },
    { label: { fr: 'Mes Commandes', ar: 'طلباتي' }, href: '/user/orders', icon: 'ClipboardDocumentListIcon' },
    { label: { fr: 'Admin', ar: 'الإدارة' }, href: '/admin', icon: 'CogIcon' }, // Added Admin link for easy access
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
    onLanguageChange?.(newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] bg-surface border-b border-border transition-smooth ${
        isScrolled ? 'shadow-elevation-2' : 'shadow-elevation-1'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/homepage" className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="ComputerDesktopIcon" size={20} className="text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-text-primary">
                  ABC Informatique
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-smooth rounded-md hover:bg-muted"
                >
                  <Icon name={item.icon as any} size={18} />
                  <span>{item.label[currentLanguage]}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop Utility Area */}
            <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
              {/* Language */}
              <button
                onClick={handleLanguageToggle}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-smooth rounded-md hover:bg-muted"
              >
                <Icon name="LanguageIcon" size={18} />
                <span className="uppercase">{currentLanguage}</span>
              </button>

              {/* THE CART SHEET (Replaces the old button) */}
              <CartSheet />

              {/* Account Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center space-x-1 rtl:space-x-reverse p-2 text-text-secondary hover:text-primary transition-smooth rounded-md hover:bg-muted"
                >
                  <Icon name="UserIcon" size={20} />
                  <Icon name="ChevronDownIcon" size={16} className={`transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Dropdown */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-3 animate-slide-down z-[101]">
                    <div className="py-1">
                      {accountMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                        >
                          <Icon name={item.icon as any} size={16} />
                          <span>{item.label[currentLanguage]}</span>
                        </Link>
                      ))}
                      <hr className="my-1 border-border" />
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-2 rtl:space-x-reverse w-full px-4 py-2 text-sm text-error hover:bg-muted transition-smooth"
                      >
                        <Icon name="ArrowRightOnRectangleIcon" size={16} />
                        <span>{currentLanguage === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
              <CartSheet />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-text-secondary hover:text-primary transition-smooth rounded-md"
              >
                <Icon name={isMobileMenuOpen ? "XMarkIcon" : "Bars3Icon"} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-border animate-slide-down h-screen overflow-y-auto pb-20">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 text-base font-medium text-text-secondary hover:text-primary hover:bg-muted transition-smooth rounded-md"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Icon name={item.icon as any} size={20} />
                    <span>{item.label[currentLanguage]}</span>
                  </div>
                </Link>
              ))}
              
              <hr className="my-2 border-border" />
              
              {accountMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 text-base font-medium text-text-secondary hover:text-primary hover:bg-muted transition-smooth rounded-md"
                >
                  <Icon name={item.icon as any} size={20} />
                  <span>{item.label[currentLanguage]}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;