'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ShoppingBag, CreditCard, User, Settings, LogOut, ChevronRight, MapPin } from 'lucide-react';

export default function UserDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setProfile(user);

        // Fetch stats from orders
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('user_id', user.id);

        if (orders) {
          const total = orders.reduce((acc, order) => acc + order.total_amount, 0);
          setStats({
            totalOrders: orders.length,
            totalSpent: total
          });
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="space-y-8">
      {/* 1. Welcome Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {profile?.user_metadata?.full_name?.[0] || <User />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Bonjour, {profile?.user_metadata?.full_name || 'Client'} !
            </h1>
            <p className="text-slate-500">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-100 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={20} /></div>
            <span className="text-slate-500 font-medium">Commandes</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CreditCard size={20} /></div>
            <span className="text-slate-500 font-medium">Dépenses Totales</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalSpent.toLocaleString()} DA</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><User size={20} /></div>
            <span className="text-slate-500 font-medium">Statut Membre</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">Standard</p>
        </div>
      </div>

      {/* 3. Quick Actions Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order History Link */}
        <Link href="/user/orders" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-violet-500 hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 group-hover:bg-violet-50 text-slate-600 group-hover:text-violet-600 rounded-xl transition-colors">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-violet-700">Mes Commandes</h3>
                <p className="text-sm text-slate-500">Suivre, retourner ou acheter à nouveau</p>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-violet-500" />
          </div>
        </Link>

        {/* Profile Settings Link (Future Feature) */}
        <div className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm opacity-60 cursor-not-allowed">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                <Settings size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Paramètres (Bientôt)</h3>
                <p className="text-sm text-slate-500">Modifier mot de passe et détails</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Book (Future Feature) */}
        <div className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm opacity-60 cursor-not-allowed">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Carnet d'adresses (Bientôt)</h3>
                <p className="text-sm text-slate-500">Gérer vos adresses de livraison</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}