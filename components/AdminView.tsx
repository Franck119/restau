import React, { useState } from 'react';
import { PlusCircle, ChefHat, Tag, DollarSign, Clock, Lock, ShieldCheck, Settings as SettingsIcon, Layers } from 'lucide-react';
import { MenuItem, Chef, EstateSettings, Modifier } from '../types.ts';
import { CURRENCY } from '../constants.tsx';

interface AdminViewProps {
  menu: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  chefs: Chef[];
  setChefs: React.Dispatch<React.SetStateAction<Chef[]>>;
  settings: EstateSettings;
  setSettings: React.Dispatch<React.SetStateAction<EstateSettings>>;
  modifiers: Modifier[];
  setModifiers: React.Dispatch<React.SetStateAction<Modifier[]>>;
}

export const AdminView: React.FC<AdminViewProps> = ({ menu, chefs, settings }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('menu');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') setIsAuthenticated(true);
    else alert("Incorrect Code");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0d0d0d] rounded-[3rem] border border-white/10 p-12 text-center">
          <Lock className="w-8 h-8 text-[#D4AF37] mx-auto mb-8" />
          <h2 className="text-3xl serif italic font-bold gold-text-gradient mb-8">Estate Authority</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-center outline-none" />
            <button type="submit" className="w-full py-5 gold-gradient text-black font-black uppercase tracking-[0.4em] rounded-full">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] pt-28 pb-40 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl serif font-bold gold-text-gradient mb-12 flex items-center gap-4"><ShieldCheck className="w-8 h-8" /> Command Hub</h1>
        <div className="bg-[#0d0d0d] rounded-[3rem] border border-white/10 p-12 text-center text-neutral-500 serif italic">
          Admin tools active. Monitoring {menu.length} assets and {chefs.length} masters.
        </div>
      </div>
    </div>
  );
};