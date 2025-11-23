'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import Link from 'next/link';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id) // Only fetch MY orders
          .order('created_at', { ascending: false });
        
        if (data) setOrders(data);
      }
      setLoading(false);
    }
    fetchMyOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
      case 'shipped': return <Truck className="text-blue-500" size={20} />;
      default: return <Clock className="text-yellow-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mes Commandes</h1>

      {loading ? (
        <div>Chargement...</div>
      ) : orders.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-100">
          <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Aucune commande</h3>
          <p className="text-slate-500 mb-6">Vous n'avez pas encore passé de commande.</p>
          <Link href="/product-catalog">
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:opacity-90">
              Commencer le shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Commande #{order.id.slice(0,8)}</p>
                  <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium capitalize">{order.status}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-lg font-black text-primary">{order.total_amount.toLocaleString()} DZD</p>
                </div>
                <Link href={`/order-details?order_id=${order.id}`}>
                  <button className="text-sm font-bold text-primary hover:underline">
                    Voir détails
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}