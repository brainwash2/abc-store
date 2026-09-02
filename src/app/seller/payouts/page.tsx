'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SellerPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('payouts').select('*').eq('seller_id', user.id).order('created_at', { ascending: false });
      if (data) setPayouts(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payouts</h1>
      {payouts.length === 0 ? (
        <p>No payouts yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Period</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.amount} DZD</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">{p.period_start} - {p.period_end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
