
import React from 'react';
import { Truck, Clock, ShieldCheck, Package, MapPin } from 'lucide-react';
import { MIN_ORDER_AMOUNT, FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '../constants';

export const Delivery: React.FC = () => {
  return (
    <div className="bg-[#f9f3e9] min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="text-orange-600" size={32} />
          </div>
          <h1 className="text-5xl font-serif italic font-black text-amber-950 uppercase tracking-tight">Доставка</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-900/40">Быстро. Горячо. По-домашнему.</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white flex flex-col md:flex-row items-center gap-8 text-left">
           <div className="p-4 bg-orange-50 rounded-full text-orange-600"><Clock size={32} /></div>
           <div>
              <h3 className="text-xl font-bold text-amber-950 mb-1">Время работы</h3>
              <p className="text-sm text-amber-900/60 leading-relaxed italic">
                Мы принимаем заказы ежедневно с <span className="text-amber-950 font-bold">10:00 до 22:00</span>. Среднее время доставки по Жулебино составляет <span className="text-orange-600 font-bold">45 минут</span>.
              </p>
           </div>
        </div>

        <div className="bg-[#3c1c0a] rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
           </div>
           <div className="relative z-10 space-y-8">
              <h2 className="text-4xl font-serif italic font-black flex items-center justify-center gap-3">
                 <MapPin className="text-orange-500" /> УСЛОВИЯ ДОСТАВКИ
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Район Жулебино</p>
              
              <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-[3rem] p-10 space-y-6 border border-white/10">
                 <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Минимальный заказ:</span>
                    <span className="text-2xl font-black">{MIN_ORDER_AMOUNT} ₽</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Доставка:</span>
                    <span className="text-xl font-black text-orange-500">Бесплатно от {FREE_DELIVERY_THRESHOLD} ₽</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Стоимость доставки:</span>
                    <span className="text-2xl font-black">{DELIVERY_FEE} ₽</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'Свежесть', icon: <ShieldCheck size={24}/>, desc: 'Готовим только под заказ из свежих продуктов' },
             { title: 'Упаковка', icon: <Package size={24}/>, desc: 'Термосумки сохраняют блюда горячими' },
             { title: 'Пунктуальность', icon: <Clock size={24}/>, desc: 'Ценим ваше время и не опаздываем' }
           ].map((item, idx) => (
             <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-sm space-y-4">
                <div className="text-orange-600 flex justify-center">{item.icon}</div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-950">{item.title}</h4>
                <p className="text-[10px] italic text-amber-950/40 leading-relaxed uppercase">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
