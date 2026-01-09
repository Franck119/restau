import React from 'react';
import { Utensils, Bell, Hotel } from 'lucide-react';
import { Order } from '../types.ts';

interface PublicStatusViewProps {
  orders: Order[];
}

export const PublicStatusView: React.FC<PublicStatusViewProps> = ({ orders }) => {
  const preparing = orders.filter(o => o.status === 'preparing');
  const ready = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-20 h-screen overflow-hidden">
      <div className="p-12 border-b border-white/5 flex justify-between items-end bg-[#080808]">
        <div>
          <div className="flex items-center gap-4 text-[#D4AF37] mb-2">
            <Hotel className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.8em]">The Royal Estate</span>
          </div>
          <h1 className="text-6xl font-black italic serif tracking-tighter leading-none uppercase">Service Feed</h1>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-16 bg-[#070707] overflow-y-auto">
          <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-neutral-500 italic mb-12">Preparing</h2>
          <div className="space-y-12">
            {preparing.map(order => (
              <div key={order.id} className="animate-fade-in border-l-2 border-[#D4AF37]/20 pl-10">
                <span className="text-5xl font-black serif italic tracking-tighter text-neutral-200 block mb-2">{order.customerName}</span>
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Suite {order.tableNumber}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-16 bg-white/[0.01] border-l border-white/5 overflow-y-auto">
          <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-[#D4AF37] italic mb-12">Ready</h2>
          <div className="space-y-10">
            {ready.map(order => (
              <div key={order.id} className="p-12 bg-[#D4AF37] rounded-[3rem] text-black shadow-xl">
                 <span className="text-6xl font-black serif italic tracking-tighter leading-none block mb-4">{order.customerName}</span>
                 <span className="font-black uppercase tracking-[0.4em] text-[10px] opacity-60">Estate Suite {order.tableNumber}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};