'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SellerApplyPage() {
  const router = useRouter();
  const [existing, setExisting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ store_name: '', legal_name: '', registre_commerce: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkExisting() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from('sellers').select('*').eq('id', user.id).maybeSingle();
      if (error) {
        console.error(error);
      }
      setExisting(data || null);
      setLoading(false);
    }
    checkExisting();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('sellers').insert({
      id: user.id,
      store_name: form.store_name,
      legal_name: form.legal_name,
      registre_commerce: form.registre_commerce,
      email: user.email,
      kyc_status: 'submitted',
      is_active: false,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/user/dashboard');
    }
    setSubmitting(false);
  };

  if (loading) return <div>Loading...</div>;

  if (existing) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Statut de votre demande</h1>
        <p>Store: {existing.store_name}</p>
        <p>KYC Status: {existing.kyc_status}</p>
        {existing.kyc_status === 'rejected' && (
          <p className="text-red-500">Rejected — contact support to reapply.</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Devenir vendeur</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Nom de la boutique" value={form.store_name} onChange={(e) => setForm({...form, store_name: e.target.value})} className="w-full border p-2" />
        <input placeholder="Nom légal" value={form.legal_name} onChange={(e) => setForm({...form, legal_name: e.target.value})} className="w-full border p-2" />
        <input placeholder="Registre de commerce" value={form.registre_commerce} onChange={(e) => setForm({...form, registre_commerce: e.target.value})} className="w-full border p-2" />
        <button disabled={submitting} className="bg-primary text-white px-4 py-2 rounded">{submitting ? 'Envoi...' : 'Soumettre'}</button>
      </form>
    </div>
  );
}
