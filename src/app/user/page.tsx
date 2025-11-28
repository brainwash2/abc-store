'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag, Calendar } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

export default function UserOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      // 1. Get Current User
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // 2. Fetch Orders for this User
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id) // 🔒 Security: Only show my orders
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
      case 'shipped': return { label: 'Expédiée', color: 'bg-blue-100 text-blue-700', icon: Truck };
      case 'delivered': return { label: 'Livrée', color: 'bg-green-100 text-green-700', icon: CheckCircle };
      case 'cancelled': return { label: 'Annulée', color: 'bg-red-100 text-red-700', icon: Package };
      default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: Package };
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="text-slate-400" size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune commande</h3>
        <p className="text-slate-500 mb-6">Vous n'avez pas encore effectué d'achat.</p>
        <Link href="/product-catalog" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Commencer le shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mes Commandes</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = getStatusConfig(order.status);
          const StatusIcon = status.icon;

          return (
            <div key={order.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold">Commande</span>
                    <span className="font-mono font-medium text-slate-900">#{order.id.slice(0, 8)}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold">Date</span>
                    <span className="font-medium text-slate-900 flex items-center gap-1">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold">Total</span>
                    <span className="font-bold text-primary">{order.total_amount.toLocaleString()} DA</span>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${status.color}`}>
                  <StatusIcon size={14} />
                  {status.label}
                </div>
              </div>

              {/* Items Preview */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3 overflow-hidden py-2">
                    {order.items && order.items.slice(0, 4).map((item: any, index: number) => (
                      <div key={index} className="relative w-12 h-12 rounded-lg border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <AppImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items && order.items.length > 4 && (
                      <div className="relative w-12 h-12 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/order-details?order_id=${order.id}`}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-violet-700 transition-colors"
                  >
                    Voir détails <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}