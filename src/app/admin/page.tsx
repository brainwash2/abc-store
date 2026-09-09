'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DollarSign, Package, ShoppingCart, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    reconciliation: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const { count: products } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: orders } = await supabase.from('orders').select('*', { count: 'exact', head: true });

      // Real revenue from paid Chargily or delivered COD
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount, payment_method, payment_status, status');

      let revenue = 0;
      if (revenueData) {
        revenue = revenueData.reduce((sum, order) => {
          const isPaid = order.payment_status === 'paid' ||
            (order.payment_method === 'cash_delivery' && order.status === 'delivered');
          return isPaid ? sum + Number(order.total_amount) : sum;
        }, 0);
      }

      const { count: reconciliation } = await supabase
        .from('chargily_reconciliation')
        .select('*', { count: 'exact', head: true });

      setStats({
        products: products || 0,
        orders: orders || 0,
        revenue,
        reconciliation: reconciliation || 0,
      });
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Produits" value={stats.products} icon={Package} color="bg-blue-500" />
        <StatCard title="Commandes" value={stats.orders} icon={ShoppingCart} color="bg-green-500" />
        <StatCard title="Revenu Réel" value={`${stats.revenue.toLocaleString()} DA`} icon={DollarSign} color="bg-purple-500" />
        <StatCard title="Réconciliation Chargily" value={stats.reconciliation} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-2xl">
        <h2 className="text-xl font-bold mb-2">Bienvenue, Admin !</h2>
        <p className="text-slate-400">Votre boutique est en ligne et connectée à Supabase 🟢</p>
      </div>
    </div>
  );
}
