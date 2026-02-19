
import React from 'react';
import { MapPin, Phone, Mail, Clock, FileText, User } from 'lucide-react';
import { LEGAL_INFO } from '../constants';

export const Contacts: React.FC = () => {
  return (
    <div className="bg-[#f9f3e9] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto text-center space-y-16">
        <div className="space-y-2">
          <h1 className="text-6xl font-serif italic font-black text-amber-950 uppercase tracking-tight">НАШИ КОНТАКТЫ</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-900/40">Мы всегда на связи!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contacts Card */}
          <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-white space-y-8 text-left">
             <div className="flex gap-6 items-start">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-950"><MapPin size={24}/></div>
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-1">Адрес</span>
                   <p className="text-amber-950 font-bold italic">{LEGAL_INFO.address}</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-950"><Phone size={24}/></div>
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-1">Телефон</span>
                   <p className="text-amber-950 font-bold italic">{LEGAL_INFO.phone}</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-950"><Mail size={24}/></div>
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-1">Email</span>
                   <p className="text-amber-950 font-bold italic">{LEGAL_INFO.email}</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-950"><Clock size={24}/></div>
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-1">Режим работы</span>
                   <p className="text-amber-950 font-bold italic">{LEGAL_INFO.workingHours}</p>
                </div>
             </div>
          </div>

          {/* Requisites Card */}
          <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-white space-y-8 text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-amber-950/5"><FileText size={120}/></div>
             <h3 className="text-2xl font-serif italic font-black text-amber-950 flex items-center gap-3">
               <FileText size={28} className="text-orange-600"/> РЕКВИЗИТЫ
             </h3>
             <div className="space-y-6 pt-4">
                <div className="flex gap-4">
                   <User className="text-orange-500/30" size={20}/>
                   <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-1">Индивидуальный предприниматель</span>
                      <p className="text-amber-950 font-bold italic text-sm">{LEGAL_INFO.owner}</p>
                   </div>
                </div>
                <div className="flex gap-12">
                   <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-1">ИНН</span>
                      <p className="text-amber-950 font-bold italic">{LEGAL_INFO.inn}</p>
                   </div>
                   <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-1">ОГРНИП</span>
                      <p className="text-amber-950 font-bold italic">{LEGAL_INFO.ogrnip}</p>
                   </div>
                </div>
                <p className="text-[9px] text-amber-900/30 leading-relaxed italic uppercase">Юридический адрес совпадает с фактическим адресом заведения. Все расчеты производятся в соответствии с законодательством РФ.</p>
             </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="relative bg-white rounded-[4rem] p-2 shadow-xl border border-white overflow-hidden aspect-video md:aspect-[21/9]">
           <div className="w-full h-full bg-[#fcf9f4] flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm"><MapPin className="text-orange-600" /></div>
              <p className="text-amber-900/20 uppercase tracking-widest font-bold text-xs italic">Яндекс Карты скоро будут здесь</p>
           </div>
           <button className="absolute bottom-10 left-10 bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-amber-950 text-xs font-bold uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">
              <MapPin size={16} className="text-red-500" /> Открыть в Яндекс Картах
           </button>
        </div>
      </div>
    </div>
  );
};
