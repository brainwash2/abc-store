'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Store } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Produits', href: '/admin/products' },
    { icon: ShoppingCart, label: 'Commandes', href: '/admin/orders' },
    { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-primary">ABC Admin</h1>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Store size={20} />
            <span className="font-medium">Voir la boutique</span>
          </Link>
          
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-slate-800 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}