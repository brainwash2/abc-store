'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface HeaderProps {
  cartItemCount?: number;
  isAuthenticated?: boolean;
  currentLanguage?: 'fr' | 'ar';
  onLanguageChange?: (language: 'fr' | 'ar') => void;
  onCartClick?: () => void;
  onAccountClick?: () => void;
}

const Header = ({ 
  cartItemCount = 0, 
  isAuthenticated = false,
  currentLanguage = 'fr',
  onLanguageChange,
  onCartClick,
  onAccountClick
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { 
      label: { fr: 'Accueil', ar: 'الرئيسية' }, 
      href: '/homepage',
      icon: 'HomeIcon'
    },
    { 
      label: { fr: 'Produits', ar: 'المنتجات' }, 
      href: '/product-catalog',
      icon: 'CubeIcon'
    },
    { 
      label: { fr: 'Panier', ar: 'السلة' }, 
      href: '/shopping-cart',
      icon: 'ShoppingCartIcon',
      badge: cartItemCount > 0 ? cartItemCount : undefined
    },
    { 
      label: { fr: 'Commandes', ar: 'الطلبات' }, 
      href: '/order-details',
      icon: 'ClipboardDocumentListIcon'
    }
  ];

  const accountMenuItems = [
    { 
      label: { fr: 'Mon Profil', ar: 'ملفي الشخصي' }, 
      href: '/profile',
      icon: 'UserIcon'
    },
    { 
      label: { fr: 'Mes Commandes', ar: 'طلباتي' }, 
      href: '/order-details',
      icon: 'ClipboardDocumentListIcon'
    },
    { 
      label: { fr: 'Paramètres', ar: 'الإعدادات' }, 
      href: '/settings',
      icon: 'CogIcon'
    },
    { 
      label: { fr: 'Aide', ar: 'المساعدة' }, 
      href: '/help',
      icon: 'QuestionMarkCircleIcon'
    }
  ];

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
    onLanguageChange?.(newLanguage);
    
    // Apply RTL/LTR direction
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const handleCartClick = () => {
    onCartClick?.();
  };

  const handleAccountClick = () => {
    onAccountClick?.();
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const closeAccountMenu = () => {
    setIsAccountMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-100 bg-surface border-b border-border transition-smooth ${
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
              {navigationItems.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-smooth rounded-md hover:bg-muted"
                >
                  <Icon name={item.icon as any} size={18} />
                  <span>{item.label[currentLanguage]}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Utility Area */}
            <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
              {/* Language Switcher */}
              <button
                onClick={handleLanguageToggle}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-smooth rounded-md hover:bg-muted"
              >
                <Icon name="LanguageIcon" size={18} />
                <span className="uppercase">{currentLanguage}</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-text-secondary hover:text-primary transition-smooth rounded-md hover:bg-muted"
              >
                <Icon name="ShoppingCartIcon" size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Account Menu */}
              <div className="relative">
                <button
                  onClick={handleAccountClick}
                  className="flex items-center space-x-1 rtl:space-x-reverse p-2 text-text-secondary hover:text-primary transition-smooth rounded-md hover:bg-muted"
                >
                  <Icon name="UserIcon" size={20} />
                  <Icon name="ChevronDownIcon" size={16} className={`transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Dropdown */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-3 animate-slide-down">
                    <div className="py-1">
                      {accountMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeAccountMenu}
                          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                        >
                          <Icon name={item.icon as any} size={16} />
                          <span>{item.label[currentLanguage]}</span>
                        </Link>
                      ))}
                      <hr className="my-1 border-border" />
                      <button className="flex items-center space-x-2 rtl:space-x-reverse w-full px-4 py-2 text-sm text-error hover:bg-muted transition-smooth">
                        <Icon name="ArrowRightOnRectangleIcon" size={16} />
                        <span>{currentLanguage === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
              {/* Mobile Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-text-secondary hover:text-primary transition-smooth rounded-md"
              >
                <Icon name="ShoppingCartIcon" size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
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
          <div className="md:hidden bg-surface border-t border-border animate-slide-down">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-3 py-3 text-base font-medium text-text-secondary hover:text-primary hover:bg-muted transition-smooth rounded-md"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Icon name={item.icon as any} size={20} />
                    <span>{item.label[currentLanguage]}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              <hr className="my-2 border-border" />
              
              {/* Mobile Account Items */}
              {accountMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 text-base font-medium text-text-secondary hover:text-primary hover:bg-muted transition-smooth rounded-md"
                >
                  <Icon name={item.icon as any} size={20} />
                  <span>{item.label[currentLanguage]}</span>
                </Link>
              ))}
              
              <hr className="my-2 border-border" />
              
              {/* Mobile Language Switcher */}
              <button
                onClick={() => {
                  handleLanguageToggle();
                  closeMobileMenu();
                }}
                className="flex items-center space-x-3 rtl:space-x-reverse w-full px-3 py-3 text-base font-medium text-text-secondary hover:text-primary hover:bg-muted transition-smooth rounded-md"
              >
                <Icon name="LanguageIcon" size={20} />
                <span>{currentLanguage === 'fr' ? 'العربية' : 'Français'}</span>
              </button>
              
              {/* Mobile Logout */}
              <button className="flex items-center space-x-3 rtl:space-x-reverse w-full px-3 py-3 text-base font-medium text-error hover:bg-muted transition-smooth rounded-md">
                <Icon name="ArrowRightOnRectangleIcon" size={20} />
                <span>{currentLanguage === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Overlay for account menu */}
      {isAccountMenuOpen && (
        <div 
          className="fixed inset-0 z-50 hidden md:block"
          onClick={closeAccountMenu}
        />
      )}
    </>
  );
};

export default Header;