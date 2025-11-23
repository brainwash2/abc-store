'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders(); // Refresh list to show new status
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold"><Clock size={12}/> En attente</span>;
      case 'shipped': return <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold"><Truck size={12}/> Expédiée</span>;
      case 'delivered': return <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12}/> Livrée</span>;
      case 'cancelled': return <span className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={12}/> Annulée</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Gestion des Commandes</h1>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Client</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Total</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Wilaya</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Statut</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center">Chargement...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Aucune commande trouvée.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-xs font-mono text-slate-500">#{order.id.slice(0,8)}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{order.customer_name}</div>
                    <div className="text-xs text-slate-500">{order.customer_phone}</div>
                  </td>
                  <td className="p-4 font-bold text-blue-600">{order.total_amount.toLocaleString()} DZD</td>
                  <td className="p-4 text-slate-600">{order.wilaya}</td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={() => updateStatus(order.id, 'shipped')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Marquer comme expédiée"
                    >
                      <Truck size={18} />
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, 'delivered')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Marquer comme livrée"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}