'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Mail, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

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
    // 1. Confirmation
    if (!confirm(`Changer le statut en "${newStatus}" ?`)) return;
    
    setUpdating(orderId);

    // 2. Update Database
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert("Erreur: " + error.message);
    } else {
      // 3. Send Email (Only if status is 'shipped' and we have an email)
      if (newStatus === 'shipped') {
        if (customerEmail) {
          try {
            await fetch('/api/emails/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'shipped',
                email: customerEmail, // Uses the real customer email from the order row
                name: customerName,
                orderId: orderId
              })
            });
            alert("Statut mis à jour & Email envoyé au client ! 📧");
          } catch (e) {
            console.error("Email failed", e);
            alert("Statut mis à jour, mais erreur d'envoi email.");
          }
        } else {
          alert("Statut mis à jour (Pas d'email client trouvé).");
        }
      } else {
        alert("Statut mis à jour !");
      }
      
      fetchOrders(); // Refresh list
    }
    setUpdating(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
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
          <p className="text-slate-500">Gestion des expéditions</p>
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
              <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono text-xs text-slate-500">#{order.id.slice(0, 8)}</td>
                <td className="p-4">
                  <div className="font-medium text-slate-900">{order.customer_name}</div>
                  {/* Display email if available, mainly for Admin verification */}
                  {order.email && <div className="text-xs text-slate-400">{order.email}</div>}
                </td>
                <td className="p-4 font-bold text-primary">{order.total_amount.toLocaleString()} DA</td>
                <td className="p-4 text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    disabled={updating === order.id}
                    value={order.status}
                    // 👇 HERE IS THE MAGIC: We pass order.email (which we will add to DB next)
                    onChange={(e) => handleStatusChange(order.id, e.target.value, order.email, order.customer_name)} 
                    className="p-2 border rounded-lg text-sm bg-white cursor-pointer hover:border-primary focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="pending">En attente</option>
                    <option value="shipped">Expédiée 🚚</option>
                    <option value="delivered">Livrée ✅</option>
                    <option value="cancelled">Annulée ❌</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}