'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import CartSheet from '@/components/layout/CartSheet';
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

const ADMIN_EMAILS = ['test@abc.com', 'contact@abc-informatique.dz']; // LIST OF ADMINS

const Header = ({ 
  currentLanguage = 'fr',
  onLanguageChange
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    
    // CHECK USER SESSION
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    checkUser();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    router.push('/login');
  };

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
    onLanguageChange?.(newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  // DYNAMIC MENU ITEMS
  const accountMenuItems = [
    ...(userEmail ? [
      { label: { fr: 'Mon Profil', ar: 'ملفي الشخصي' }, href: '/user/dashboard', icon: 'UserIcon' },
      { label: { fr: 'Mes Commandes', ar: 'طلباتي' }, href: '/user/orders', icon: 'ClipboardDocumentListIcon' }
    ] : [
      { label: { fr: 'Se connecter', ar: 'تسجيل الدخول' }, href: '/login', icon: 'UserIcon' },
      { label: { fr: 'Créer un compte', ar: 'إنشاء حساب' }, href: '/register', icon: 'UserPlusIcon' }
    ]),
    // Only show Admin if email matches
    ...(userEmail && ADMIN_EMAILS.includes(userEmail) ? [{ 
      label: { fr: 'Admin', ar: 'الإدارة' }, href: '/admin', icon: 'CogIcon' 
    }] : []), 
  ];

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
                <span className="text-xl font-semibold text-text-primary">ABC Informatique</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <Link href="/homepage" className="text-sm font-medium text-text-secondary hover:text-primary">
                {currentLanguage === 'fr' ? 'Accueil' : 'الرئيسية'}
              </Link>
              <Link href="/product-catalog" className="text-sm font-medium text-text-secondary hover:text-primary">
                {currentLanguage === 'fr' ? 'Produits' : 'المنتجات'}
              </Link>
              {/* BLOG LINK ADDED */}
              <Link href="/blog" className="text-sm font-medium text-text-secondary hover:text-primary">
                {currentLanguage === 'fr' ? 'Actualités' : 'أخبار'}
              </Link>
            </nav>

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
              <button onClick={handleLanguageToggle} className="p-2 hover:bg-muted rounded-md">
                <span className="uppercase font-bold text-sm">{currentLanguage}</span>
              </button>

              <CartSheet />

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="p-2 hover:bg-muted rounded-md">
                  <Icon name="UserIcon" size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg hidden group-hover:block">
                  {accountMenuItems.map((item) => (
                    <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
                      <Icon name={item.icon as any} size={16} />
                      {item.label[currentLanguage]}
                    </Link>
                  ))}
                  {userEmail && (
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                      <Icon name="ArrowRightOnRectangleIcon" size={16} />
                      Déconnexion
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;