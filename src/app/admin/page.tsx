'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    async function loadStats() {
      // Get Product Count
      const { count: products } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      // Get Order Count
      const { count: orders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      
      // Calculate Revenue (Mock for now, or sum actual orders if you have them)
      setStats({ products: products || 0, orders: orders || 0, revenue: (orders || 0) * 125000 });
    }
    loadStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-full ${color} text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h3 className="text-2xl font-black text-slate-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard Vue d'ensemble</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Produits" 
          value={stats.products} 
          icon={Package} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Commandes" 
          value={stats.orders} 
          icon={ShoppingCart} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Revenu Total (Est.)" 
          value={`${stats.revenue.toLocaleString()} DA`} 
          icon={DollarSign} 
          color="bg-purple-500" 
        />
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-2xl">
        <h2 className="text-xl font-bold mb-2">Bienvenue, Admin !</h2>
        <p className="text-slate-400">Votre boutique est en ligne et connectée à Supabase 🟢</p>
      </div>
    </div>
  );
}