
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, X, Loader2, Clock, MapPin, Minus, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../constants';
import { Category, Dish } from '../types';
import { apiClient } from '../apiClient';
import { supabase } from '../lib/supabase';

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalQty, setModalQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    apiClient.getDishes()
      .then(setDishes)
      .catch(console.error)
      .finally(() => setLoading(false));

    const channel = supabase
      .channel('menu-realtime')
      .on('postgres_changes', { event: '*', table: 'dishes' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setDishes(prev => [...prev, payload.new as Dish]);
        } else if (payload.eventType === 'UPDATE') {
          setDishes(prev => prev.map(d => d.id === payload.new.id ? payload.new as Dish : d));
        } else if (payload.eventType === 'DELETE') {
          setDishes(prev => prev.filter(d => d.id === payload.old.id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      const matchesCategory = activeCategory === 'all' || dish.category === activeCategory;
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && dish.available;
    });
  }, [activeCategory, searchQuery, dishes]);

  const handleOpenModal = (dish: Dish) => {
    setSelectedDish(dish);
    setModalQty(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-amber-950 italic">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="animate-pulse tracking-widest uppercase text-xs font-bold">Разогреваем тандыр...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-[#f9f3e9]">
      {/* Hero Section */}
      <section className="pt-6 pb-12 px-4 flex justify-center">
        <div className="w-full max-w-lg bg-[#3c1c0a] rounded-[4rem] p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="flex flex-col mb-10">
              <span className="text-4xl md:text-5xl font-serif text-white uppercase tracking-wider font-bold italic">Чайхана</span>
              <span className="text-5xl md:text-6xl font-serif text-orange-600 uppercase tracking-tighter font-bold italic -mt-2">Жулебино</span>
            </h1>
            <div className="space-y-4 max-w-[280px] mx-auto">
              <div className="bg-amber-900/30 backdrop-blur-md rounded-[1.5rem] py-4 px-6 flex items-center justify-center gap-3 border border-white/5">
                <Clock className="text-orange-500" size={24} />
                <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">45 мин доставка</span>
              </div>
              <div className="bg-amber-900/30 backdrop-blur-md rounded-[1.5rem] py-6 px-6 flex items-center justify-center gap-3 border border-white/5">
                <MapPin className="text-orange-500" size={24} />
                <span className="text-white text-xs font-bold uppercase tracking-[0.1em] text-center leading-tight">
                  Жулебинский бульвар<br/>дом 26
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] shadow-sm mb-12 border border-white/50">
          <div className="flex flex-col gap-8">
            <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-3 w-full">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap shadow-sm ${
                  activeCategory === 'all' ? 'bg-[#3c1c0a] text-white' : 'bg-white text-amber-900/40'
                }`}
              >
                Все блюда
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap shadow-sm ${
                    activeCategory === cat.id ? 'bg-[#3c1c0a] text-white' : 'bg-white text-amber-900/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-900/20" size={20} />
              <input
                type="text"
                placeholder="Поиск блюд..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border-none rounded-full py-5 pl-16 pr-8 text-amber-950 placeholder-amber-900/20 focus:ring-2 focus:ring-orange-500 shadow-sm text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDishes.map(dish => (
            <div key={dish.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => handleOpenModal(dish)}>
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-950 shadow-sm">{dish.weight}</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif italic text-amber-950">{dish.name}</h3>
                </div>
                <div className="text-orange-600 font-bold text-lg mb-4">{dish.price} ₽</div>
                <button onClick={() => addItem(dish)} className="w-full bg-amber-50 text-amber-950 py-4 rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-[#3c1c0a] hover:text-white transition-all">
                  <Plus size={16} /> Добавить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redesigned Modal based on Screenshot */}
      {selectedDish && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex justify-between items-center border-b border-amber-900/5">
              <h2 className="text-base font-bold text-amber-950 italic">{selectedDish.name}</h2>
              <button onClick={() => setSelectedDish(null)} className="text-amber-950/20 hover:text-amber-950 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-lg">
                <img src={selectedDish.image} className="w-full h-full object-cover" />
                <div className="absolute bottom-6 right-6 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white/20">
                  {selectedDish.price} ₽
                </div>
              </div>

              <p className="text-amber-950/60 text-xs italic text-center px-4">
                {selectedDish.description || "Наваристый и ароматный вкус востока."}
              </p>

              <div className="bg-amber-50/50 rounded-[1.5rem] p-6 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-950 uppercase tracking-widest opacity-60">
                  <Info size={14} /> Состав
                </div>
                <p className="text-amber-900/70 text-xs leading-relaxed">
                  {selectedDish.ingredients || "Специи, мясо, овощи, любовь повара."}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center justify-between bg-amber-50 rounded-2xl p-2 h-14">
                  <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="w-10 h-10 flex items-center justify-center text-amber-950/40"><Minus size={18} /></button>
                  <span className="font-bold text-lg text-amber-950">{modalQty}</span>
                  <button onClick={() => setModalQty(modalQty + 1)} className="w-10 h-10 flex items-center justify-center text-amber-950/40"><Plus size={18} /></button>
                </div>
                <button 
                  onClick={() => { for(let i=0; i<modalQty; i++) addItem(selectedDish); setSelectedDish(null); }}
                  className="flex-[2] bg-[#3c1c0a] text-white h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-amber-950/20 hover:bg-orange-600 transition-all"
                >
                  <Plus size={16} /> Добавить в корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
