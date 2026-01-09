import React, { useState, useMemo } from 'react';
import { X, Check, Utensils, Clock, Gift, User, Calendar, Package, Home, ChevronRight, ChevronLeft, MessageSquare, Info, MapPin, CreditCard, Banknote, ShieldAlert, Truck, PhoneCall, Headphones, Sparkles } from 'lucide-react';
import { MenuItem, OrderItem, Modifier, Chef, DiningOption, EventType, PaymentMethod, EstateSettings } from '../types.ts';
import { CURRENCY, GIFTS } from '../constants.tsx';

interface CustomerViewProps {
  tableNumber: string;
  onPlaceOrder: (items: OrderItem[], customerName: string, chefName: string, gift: string, diningOption: DiningOption, guestCount?: number, reservationDate?: string, reservationTime?: string, eventType?: EventType, specialInstructions?: string, paymentMethod?: PaymentMethod, depositAmount?: number, isPaid?: boolean, deliveryAddress?: string) => void;
  menu: MenuItem[];
  chefs: Chef[];
  settings: EstateSettings;
}

type OrderStep = 'MODE_SELECTION' | 'SCHEDULING' | 'STARTERS' | 'MAINS' | 'DRINKS' | 'SIDES' | 'CONFIRMATION' | 'PAYMENT';

export const CustomerView: React.FC<CustomerViewProps> = ({ tableNumber, onPlaceOrder, menu, chefs, settings }) => {
  const [step, setStep] = useState<OrderStep>('MODE_SELECTION');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeModifiers, setActiveModifiers] = useState<Modifier[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [diningOption, setDiningOption] = useState<DiningOption | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedChef, setSelectedChef] = useState<Chef>(chefs[0] || { id: '', name: 'Chef', specialty: '', avatar: '' });
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('none');
  const [unlockedGift, setUnlockedGift] = useState("");
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);

  const steps: OrderStep[] = ['STARTERS', 'MAINS', 'DRINKS', 'SIDES'];
  const stepLabels: Record<OrderStep, string> = {
    'MODE_SELECTION': 'Experience',
    'SCHEDULING': 'Logistics',
    'STARTERS': 'Beginnings',
    'MAINS': 'Signatures',
    'DRINKS': 'Elixirs',
    'SIDES': 'Accompaniments',
    'CONFIRMATION': 'Review',
    'PAYMENT': 'Checkout'
  };

  const currentDayName = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  }, []);

  const dailyOffers = useMemo(() => {
    return settings.specialOffers.filter(o => o.day === currentDayName && o.isActive);
  }, [settings.specialOffers, currentDayName]);

  const isMenuStep = steps.includes(step);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.totalPrice, 0), [cart]);
  const depositAmount = diningOption === 'reservation' ? cartTotal * 0.5 : 0;

  const currentCategory = useMemo(() => {
    if (step === 'STARTERS') return 'Starters';
    if (step === 'MAINS') return 'Main Dishes';
    if (step === 'DRINKS') return 'Drinks';
    if (step === 'SIDES') return 'Sides';
    return '';
  }, [step]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => 
      diningOption && 
      item.allowedOptions.includes(diningOption) && 
      item.category === currentCategory
    );
  }, [diningOption, currentCategory, menu]);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setActiveModifiers([]);
  };

  const confirmItemSelection = () => {
    if (!selectedItem) return;
    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      basePrice: selectedItem.price,
      modifiers: [...activeModifiers],
      totalPrice: selectedItem.price + activeModifiers.reduce((acc, m) => acc + m.price, 0),
      estimatedTime: selectedItem.estimatedTime
    };
    setCart([...cart, newItem]);
    setSelectedItem(null);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const nextStep = () => {
    if (step === 'STARTERS') setStep('MAINS');
    else if (step === 'MAINS') setStep('DRINKS');
    else if (step === 'DRINKS') setStep('SIDES');
    else if (step === 'SIDES') setStep('CONFIRMATION');
    else if (step === 'CONFIRMATION') setStep('PAYMENT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (step === 'PAYMENT') setStep('CONFIRMATION');
    else if (step === 'CONFIRMATION') setStep('SIDES');
    else if (step === 'SIDES') setStep('DRINKS');
    else if (step === 'DRINKS') setStep('MAINS');
    else if (step === 'MAINS') setStep('STARTERS');
    else if (step === 'STARTERS') setStep(diningOption === 'reservation' || diningOption === 'pickup' || diningOption === 'delivery' ? 'SCHEDULING' : 'MODE_SELECTION');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrderFinal = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const gift = GIFTS[Math.floor(Math.random() * GIFTS.length)];
      setUnlockedGift(gift);
      const isPaid = paymentMethod === 'mobile_money' && (diningOption === 'reservation' || diningOption === 'pickup' || diningOption === 'delivery');
      onPlaceOrder(cart, customerName, selectedChef.name, gift, diningOption!, 1, reservationDate, reservationTime, 'standard', specialInstructions, paymentMethod, depositAmount, isPaid, deliveryAddress);
      setIsProcessingPayment(false);
      setShowGiftModal(true);
    }, 2500);
  };

  const AdviceButton = () => (
    <button 
      onClick={() => setShowAdviceModal(true)}
      className="fixed bottom-24 right-6 z-[80] w-14 h-14 bg-[#D4AF37] text-black rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center justify-center animate-bounce hover:scale-110 active:scale-95 transition-all"
    >
      <Headphones className="w-6 h-6" />
    </button>
  );

  if (step === 'MODE_SELECTION') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-start overflow-y-auto pb-10">
        <AdviceButton />
        <div className="w-full h-[60vh] md:h-[65vh] relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=90" className="w-full h-full object-cover opacity-70 scale-105 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-center">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter gold-text-gradient mb-4 drop-shadow-2xl">AfroFeast</h1>
            <p className="text-[10px] md:text-[12px] uppercase tracking-[0.6em] md:tracking-[1em] text-neutral-400 font-bold mb-8">Culinary Mastery • Royal Heritage</p>
            <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">
              <MapPin className="w-4 h-4" /> Guest Suite {tableNumber}
            </div>
          </div>
        </div>

        <div className="max-w-5xl w-full px-6 -mt-10 md:-mt-16 pb-24 z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fade-in">
          {[
            { id: 'eat-in', title: 'Dine In-Suite', desc: 'Personal service at your table', icon: <Utensils className="w-7 h-7" /> },
            { id: 'delivery', title: 'Royal Delivery', desc: 'Grand delivery to your residence', icon: <Truck className="w-7 h-7" /> },
            { id: 'reservation', title: 'Bespoke Event', desc: 'Plan a future grand banquet', icon: <Calendar className="w-7 h-7" /> },
            { id: 'pickup', title: 'Executive Pickup', desc: 'Gourmet collection scheduled', icon: <Package className="w-7 h-7" /> },
            { id: 'takeaway', title: 'Instant Take-away', desc: 'Prepared for transport now', icon: <Home className="w-7 h-7" /> },
          ].map((opt) => (
            <button key={opt.id} onClick={() => { setDiningOption(opt.id as DiningOption); setStep(opt.id === 'reservation' || opt.id === 'pickup' || opt.id === 'delivery' ? 'SCHEDULING' : 'STARTERS'); }} className="group p-8 md:p-10 bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] flex items-center gap-6 md:gap-8 text-left transition-all hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/40 shadow-2xl">
              <div className="p-5 md:p-6 bg-neutral-900 rounded-2xl md:rounded-3xl border border-white/5 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0">{opt.icon}</div>
              <div>
                <h3 className="text-xl md:text-2xl serif font-bold text-white mb-1 md:mb-2">{opt.title}</h3>
                <p className="text-xs md:text-sm text-neutral-500 italic font-light leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#D4AF37] serif italic text-3xl">
      <div className="animate-pulse">Loading AfroFeast Heritage...</div>
    </div>
  );
};