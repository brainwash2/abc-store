'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import CartSheet from '@/components/layout/CartSheet';
import { useCartStore } from '@/store/useCart';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react'; // Import Menu icons

interface HeaderProps {
  cartItemCount?: number;
  isAuthenticated?: boolean;
  currentLanguage?: 'fr' | 'ar';
  onLanguageChange?: (language: 'fr' | 'ar') => void;
  onCartClick?: () => void;
  onAccountClick?: () => void;
}

const ADMIN_EMAILS = ['test@abc.com', 'contact@abc-informatique.dz', 'admin@abc.com'];

const Header = ({ 
  currentLanguage = 'fr',
  onLanguageChange
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile State
  const router = useRouter();
  
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    
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
    setIsMobileMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
    onLanguageChange?.(newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const accountMenuItems = [
    ...(userEmail ? [
      { label: { fr: 'Mon Profil', ar: 'ملفي الشخصي' }, href: '/user/dashboard', icon: 'UserIcon' },
      { label: { fr: 'Mes Commandes', ar: 'طلباتي' }, href: '/user/orders', icon: 'ClipboardDocumentListIcon' }
    ] : [
      { label: { fr: 'Se connecter', ar: 'تسجيل الدخول' }, href: '/login', icon: 'UserIcon' },
      { label: { fr: 'Créer un compte', ar: 'إنشاء حساب' }, href: '/register', icon: 'UserPlusIcon' }
    ]),
    ...(userEmail && ADMIN_EMAILS.includes(userEmail) ? [{ 
      label: { fr: 'Admin', ar: 'الإدارة' }, href: '/admin', icon: 'CogIcon' 
    }] : []), 
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-200 transition-all duration-300 ${
      isScrolled ? 'shadow-md py-2' : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* 1. Logo */}
          <Link href="/homepage" className="flex items-center gap-2 z-50">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <Icon name="ComputerDesktopIcon" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ABC<span className="text-violet-600">.store</span></span>
          </Link>

          {/* 2. Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/homepage" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              {currentLanguage === 'fr' ? 'Accueil' : 'الرئيسية'}
            </Link>
            <Link href="/product-catalog" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              {currentLanguage === 'fr' ? 'Produits' : 'المنتجات'}
            </Link>
            <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              {currentLanguage === 'fr' ? 'Actualités' : 'أخبار'}
            </Link>
          </nav>

          {/* 3. Icons & Actions */}
          <div className="flex items-center gap-2">
            
            {/* Language Toggle */}
            <button onClick={handleLanguageToggle} className="p-2 hover:bg-slate-100 rounded-full transition-colors font-bold text-xs text-slate-600">
              {currentLanguage}
            </button>

            {/* Cart */}
            <CartSheet />

            {/* Desktop Profile Dropdown (Hidden on Mobile) */}
            <div className="hidden md:block relative group h-full">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700">
                <Icon name="UserIcon" size={22} />
              </button>
              <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                <div className="bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden p-1">
                  {userEmail && (
                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 mb-1">
                      <p className="text-xs text-slate-500">Connecté en tant que</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{userEmail}</p>
                    </div>
                  )}
                  {accountMenuItems.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700 rounded-lg transition-colors">
                      <Icon name={item.icon as any} size={18} />
                      {item.label[currentLanguage]}
                    </Link>
                  ))}
                  {userEmail && (
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1">
                      <Icon name="ArrowRightOnRectangleIcon" size={18} />
                      Déconnexion
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Mobile Menu Button (Visible ONLY on Mobile) */}
            <button 
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-in slide-in-from-top-10 fade-in duration-200">
          <nav className="flex flex-col gap-6 text-lg font-medium text-slate-800">
            <Link href="/homepage" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 pb-4">
              {currentLanguage === 'fr' ? 'Accueil' : 'الرئيسية'} <Icon name="ChevronRightIcon" size={20} className="text-slate-400" />
            </Link>
            <Link href="/product-catalog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 pb-4">
              {currentLanguage === 'fr' ? 'Produits' : 'المنتجات'} <Icon name="ChevronRightIcon" size={20} className="text-slate-400" />
            </Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 pb-4">
              {currentLanguage === 'fr' ? 'Actualités' : 'أخبار'} <Icon name="ChevronRightIcon" size={20} className="text-slate-400" />
            </Link>
            
            <div className="pt-4 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compte</p>
              {accountMenuItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2 text-slate-600">
                  <Icon name={item.icon as any} size={20} />
                  {item.label[currentLanguage]}
                </Link>
              ))}
              {userEmail && (
                <button onClick={handleLogout} className="flex items-center gap-3 py-2 text-red-600 w-full text-left">
                  <Icon name="ArrowRightOnRectangleIcon" size={20} />
                  Déconnexion
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;