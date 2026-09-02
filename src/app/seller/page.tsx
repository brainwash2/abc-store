'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SellerDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
      }

      setProfile(data || null);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  if (!profile) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">No seller profile found</h1>
        <p>You are not registered as a seller, or your application was rejected.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {profile.store_name}</h1>
      <p>KYC Status: {profile.kyc_status}</p>
      <p>Active: {profile.is_active ? 'Yes' : 'No'}</p>
    </div>
  );
}
