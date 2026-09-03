'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    const { data } = await supabase.from('payouts').select('*, sellers(store_name, email)');
    if (data) setPayouts(data);
    setLoading(false);
  };

  const handleGenerate = async () => {
    const res = await fetch('/api/admin/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate', period_start: start, period_end: end }),
    });
    if (res.ok) {
      fetchPayouts();
      alert('Payouts generated');
    } else {
      alert('Generation failed');
    }
  };

  const handleMarkPaid = async (payoutId: string) => {
    const res = await fetch('/api/admin/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_paid', payoutId }),
    });
    if (res.ok) {
      fetchPayouts();
    } else {
      alert('Mark paid failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payouts</h1>
      <div className="flex gap-2">
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="border p-2" />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="border p-2" />
        <button onClick={handleGenerate} className="bg-primary text-white px-4 py-2 rounded">Generate</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2">Seller</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Period</th>
            <th className="p-2">Paid At</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.sellers?.store_name}</td>
              <td className="p-2">{p.amount} DZD</td>
              <td className="p-2">{p.status}</td>
              <td className="p-2">{p.period_start} - {p.period_end}</td>
              <td className="p-2">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '-'}</td>
              <td className="p-2">
                {p.status === 'pending' && (
                  <button
                    onClick={() => handleMarkPaid(p.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Mark Paid
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
