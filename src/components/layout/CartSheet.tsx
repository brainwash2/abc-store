'use client';

import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from '@/store/useCart';
import Link from "next/link";

export default function CartSheet() {
  const { items, removeItem, total } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Mon Panier</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-slate-500">Votre panier est vide.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <img src={item.image} alt={item.title} className="h-16 w-16 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-primary font-bold">{item.price.toLocaleString()} DZD</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs">Qté: {item.quantity}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 text-xs">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{total().toLocaleString()} DZD</span>
            </div>
            <Link href="/checkout" className="w-full">
              <Button className="w-full bg-primary">Procéder au paiement</Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}