'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    const { data } = await supabase
      .from('sellers')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setSellers(data);
    setLoading(false);
  };

  const handleAction = async (sellerId: string, action: 'approve' | 'reject') => {
    const res = await fetch('/api/admin/sellers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, sellerId }),
    });
    if (res.ok) {
      fetchSellers();
    } else {
      alert('Action failed');
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des vendeurs</h1>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2">Store</th>
            <th className="p-2">Email</th>
            <th className="p-2">KYC Status</th>
            <th className="p-2">Active</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr key={seller.id} className="border-t">
              <td className="p-2">{seller.store_name}</td>
              <td className="p-2">{seller.email}</td>
              <td className="p-2">{seller.kyc_status}</td>
              <td className="p-2">{seller.is_active ? 'Yes' : 'No'}</td>
              <td className="p-2 space-x-2">
                {seller.kyc_status !== 'approved' && (
                  <button
                    onClick={() => handleAction(seller.id, 'approve')}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
                {seller.kyc_status !== 'rejected' && (
                  <button
                    onClick={() => handleAction(seller.id, 'reject')}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
