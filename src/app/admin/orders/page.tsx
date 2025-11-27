'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Truck, CheckCircle, Clock, AlertCircle, Mail } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string, customerEmail: string, customerName: string) => {
    if (!confirm(`Changer le statut en "${newStatus}" ?`)) return;
    
    setUpdating(orderId);

    // 1. Update Database
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert("Erreur: " + error.message);
    } else {
      // 2. If Shipped, Send Email
      if (newStatus === 'expediee' && customerEmail) {
        try {
          await fetch('/api/emails/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'shipped', // <--- Tells API to send shipping email
              email: customerEmail,
              name: customerName,
              orderId: orderId
            })
          });
          alert("Email d'expédition envoyé ! 📧");
        } catch (e) {
          console.error("Email failed", e);
        }
      }
      
      // Refresh UI
      fetchOrders();
    }
    setUpdating(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expediee': return 'bg-blue-100 text-blue-800';
      case 'livree': return 'bg-green-100 text-green-800';
      case 'annulee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Commandes</h1>
          <p className="text-slate-500">Suivez vos ventes et expéditions</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Chercher client ou ID..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Client</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Total</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Statut</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center">Chargement...</td></tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-mono text-xs text-slate-500">#{order.id.slice(0, 8)}</td>
                <td className="p-4 font-medium text-slate-900">
                  {order.customer_name}
                  {/* We need to fetch email from auth users in a real app, but for now we assume we might have it or skip */}
                </td>
                <td className="p-4 font-bold text-primary">{order.total_amount.toLocaleString()} DA</td>
                <td className="p-4 text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    disabled={updating === order.id}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value, 'sirmohamed7@gmail.com', order.customer_name)} 
                    // ⚠️ NOTE: In a real app, we need to join the 'users' table to get the real email. 
                    // For this demo, I hardcoded YOUR email so you can test the notification.
                    className="p-2 border rounded-lg text-sm bg-white cursor-pointer hover:border-primary focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="pending">En attente</option>
                    <option value="expediee">Expédiée 🚚</option>
                    <option value="livree">Livrée ✅</option>
                    <option value="annulee">Annulée ❌</option>
                  </select>
                  {updating === order.id && <span className="ml-2 text-xs text-slate-400">...</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}