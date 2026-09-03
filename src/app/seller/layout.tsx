'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const nav = [
    { href: '/seller', label: 'Dashboard' },
    { href: '/seller/products', label: 'Products' },
    { href: '/seller/orders', label: 'Orders' },
    { href: '/seller/payouts', label: 'Payouts' },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-900 text-white">
        <div className="p-4 text-xl font-bold">Seller Panel</div>
        <nav className="space-y-2 p-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`block p-2 rounded hover:bg-slate-700 ${pathname === item.href ? 'bg-slate-700' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
