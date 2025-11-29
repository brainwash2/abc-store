
'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/20">
                <Icon name="ComputerDesktopIcon" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">ABC.store</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Votre partenaire de confiance pour le matériel informatique en Algérie. 
              Qualité garantie, livraison rapide et service client premium.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all duration-300">
                <Icon name="InstagramIcon" size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Icon name="FacebookIcon" size={20} />
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Boutique</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/product-catalog" className="hover:text-violet-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-violet-500 rounded-full"></span> Tous les produits</Link></li>
              <li><Link href="/product-catalog?category=Laptops" className="hover:text-violet-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-slate-600 rounded-full"></span> Ordinateurs</Link></li>
              <li><Link href="/product-catalog?category=Smartphones" className="hover:text-violet-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-slate-600 rounded-full"></span> Smartphones</Link></li>
              <li><Link href="/product-catalog?category=Gaming" className="hover:text-violet-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-slate-600 rounded-full"></span> Gaming</Link></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Service Client</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/user/orders" className="hover:text-violet-400 transition-colors">Suivre ma commande</Link></li>
              <li><Link href="/contact" className="hover:text-violet-400 transition-colors">Nous contacter</Link></li>
              <li><Link href="/blog" className="hover:text-violet-400 transition-colors">Actualités Tech</Link></li>
              <li><Link href="/login" className="hover:text-violet-400 transition-colors">Mon Compte</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Icon name="MapPinIcon" size={20} className="text-violet-500 shrink-0 mt-1" />
                <span>07 Rue Azzouz Abdellah,<br/>Zeralda, Alger</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="PhoneIcon" size={20} className="text-violet-500 shrink-0" />
                <span className="font-mono">+213 550 12 34 56</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="EnvelopeIcon" size={20} className="text-violet-500 shrink-0" />
                <span>contact@abc-informatique.dz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2025 ABC Informatique. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">Conditions Générales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}