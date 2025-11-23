'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, ShoppingBag, LogOut, Home } from 'lucide-react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Go back to homepage
  };

  const menuItems = [
    { icon: Home, label: 'Accueil Boutique', href: '/' },
    { icon: User, label: 'Mon Profil', href: '/user/dashboard' },
    { icon: ShoppingBag, label: 'Mes Commandes', href: '/user/orders' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:fixed md:h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-black text-primary">Mon Compte</h1>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-8"
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}