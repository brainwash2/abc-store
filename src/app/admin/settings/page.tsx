'use client';

import React from 'react';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Paramètres de la Boutique</h1>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
        
        {/* Store Info */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Informations Générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nom de la boutique</label>
              <input defaultValue="ABC Informatique" className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email de contact</label>
              <input defaultValue="contact@abc-informatique.dz" className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
              <input defaultValue="0550 12 34 56" className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
              <input defaultValue="Alger Centre, Algérie" className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50" />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Payment Settings */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Paiement & Livraison</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <span className="font-medium">Activer Baridi Mob</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <span className="font-medium">Activer Paiement à la livraison</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700">
            <Save size={20} /> Enregistrer les modifications
          </button>
        </div>

      </div>
    </div>
  );
}