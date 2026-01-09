import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Play, Utensils, ChefHat, Timer, AlertTriangle, CreditCard, Banknote, Truck, MapPin } from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';
import { CURRENCY } from '../constants.tsx';

const CountdownDisplay = ({ createdAt, maxEstimatedTime }: { createdAt: number, maxEstimatedTime: number }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = createdAt + (maxEstimatedTime * 60 * 1000);
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeLeft(remaining);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [createdAt, maxEstimatedTime]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className={`flex flex-col items-end gap-1 p-3 rounded-2xl border ${timeLeft === 0 ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-[#D4AF37]/10 border-[#D4AF37]/40'}`}>
       <div className="flex items-center gap-2">
         <Timer className={`w-3 h-3 ${timeLeft === 0 ? 'text-red-500' : 'text-[#D4AF37]'}`} />
         <span className={`text-[9px] font-black uppercase tracking-widest ${timeLeft === 0 ? 'text-red-500' : 'text-neutral-500'}`}>Remaining</span>
       </div>
       <span className={`text-2xl font-black font-mono tracking-tighter leading-none ${timeLeft === 0 ? 'text-red-500' : 'text-[#D4AF37]'}`}>
         {timeLeft === 0 ? 'LATE' : `${minutes}:${seconds.toString().padStart(2, '0')}`}
       </span>
    </div>
  );
};

interface KitchenViewProps {
  orders: Order[];
  updateStatus: (orderId: string, status: OrderStatus) => void;
}

export const KitchenView: React.FC<KitchenViewProps> = ({ orders, updateStatus }) => {
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] p-6 md:p-10 pt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div>
          <h1 className="text-4xl serif font-bold gold-text-gradient flex items-center gap-4 uppercase italic tracking-tighter">Chef Hub</h1>
          <p className="text-neutral-500 font-light tracking-[0.3em] uppercase text-[9px] mt-2 italic">Precision Monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
        {activeOrders.map((order) => (
          <div key={order.id} className="flex flex-col rounded-[2.5rem] overflow-hidden border bg-[#0d0d0d] border-white/5 shadow-lg">
              <div className="p-8 flex justify-between items-start bg-white/5">
                <div className="flex-1">
                  <span className="text-2xl font-black italic serif tracking-tighter block mb-1 text-white">{order.customerName}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1 rounded-lg">Suite {order.tableNumber}</span>
                </div>
                <CountdownDisplay createdAt={order.createdAt} maxEstimatedTime={order.maxEstimatedTime} />
              </div>

              <div className="p-8 flex-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pb-3 border-b border-white/5 last:border-0 mb-3">
                    <h4 className="font-bold text-lg serif italic text-white">{item.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.modifiers.map(m => (
                        <span key={m.id} className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-red-500/40 text-red-400">
                          {m.type === 'remove' ? 'NO ' : '+ '}{m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 pt-0">
                <button onClick={() => updateStatus(order.id, order.status === 'pending' ? 'preparing' : 'ready')} className="w-full py-5 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 hover:bg-[#D4AF37]">
                  {order.status === 'pending' ? <><Play className="w-4 h-4 fill-current" /> Prep</> : <><CheckCircle2 className="w-4 h-4" /> Ready</>}
                </button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};