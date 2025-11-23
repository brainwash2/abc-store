'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Bonjour, {user?.user_metadata?.full_name || 'Client'} 👋
        </h1>
        <p className="text-slate-500">Heureux de vous revoir sur ABC Informatique.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
          <h3 className="font-bold text-primary mb-2">Mes Commandes</h3>
          <p className="text-sm text-slate-600 mb-4">Suivez vos achats et retours.</p>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">
            Voir l'historique
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-2">Informations Personnelles</h3>
          <p className="text-sm text-slate-500">Email: {user?.email}</p>
        </div>
      </div>
    </div>
  );
}