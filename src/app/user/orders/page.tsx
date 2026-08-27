'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyOrders() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        const ordersWithItems = await Promise.all(
          data.map(async (order) => {
            const { data: items } = await supabase
              .from('order_items')
              .select('quantity, product_id, products(name, image_url)')
              .eq('order_id', order.id);

            return { ...order, items: items || [] };
          })
        );

        setOrders(ordersWithItems);
      }
      setLoading(false);
    }
    fetchMyOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
      case 'shipped': return <Truck className="text-blue-500" size={20} />;
      default: return <Clock className="text-yellow-500" size={20} />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (orders.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mes Commandes</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Commande #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {getStatusIcon(order.status)}
                <span className="text-sm font-medium capitalize">{order.status}</span>
              </div>
            </div>

            <div className="flex -space-x-3 overflow-hidden py-2">
              {order.items.slice(0, 4).map((item: any, index: number) => (
                <div key={index} className="relative w-12 h-12 rounded-lg border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                  {item.products?.image_url && (
                    <img src={item.products.image_url} alt={item.products.name || 'produit'} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="relative w-12 h-12 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                  +{order.items.length - 4}
                </div>
              )}
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
    </div>
  );
}
