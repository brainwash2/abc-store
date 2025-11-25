'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Store,
  FileText // <--- NEW IMPORT
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Security Check (Keep your existing security logic here)
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'admin@abc.com') { // Replace with your admin email
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Produits', href: '/admin/products' },
    { icon: ShoppingCart, label: 'Commandes', href: '/admin/orders' },
    { icon: FileText, label: 'Blog', href: '/admin/blog' }, // <--- NEW ITEM
    { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-primary-400 font-bold text-xl">
            <Store /> ABC Admin
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} /> Déconnexion
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