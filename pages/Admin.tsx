
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Plus, Trash2, Check, XCircle, Loader2, Edit3, 
  Save, Calendar, TrendingUp, DollarSign, ShoppingBag, RefreshCw, 
  Eye, Bell, X, Package, Trash, MapPin, Phone, CheckCircle, Upload, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../apiClient';
import { supabase } from '../lib/supabase';
import { Order, OrderStatus, Dish, Category } from '../types';
import { CATEGORIES } from '../constants';

export const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'history' | 'stop' | 'menu' | 'stats'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Dish Editor Modal State
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Partial<Dish> | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    loadData();

    const orderChannel = supabase
      .channel('admin-orders-full')
      .on('postgres_changes', { event: '*', table: 'orders' }, () => { 
        apiClient.getAllOrders().then(setOrders);
      })
      .subscribe();

    const dishChannel = supabase
      .channel('admin-dishes-full')
      .on('postgres_changes', { event: '*', table: 'dishes' }, () => {
        apiClient.getDishes().then(setDishes);
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(dishChannel);
    };
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [o, d] = await Promise.all([apiClient.getAllOrders(), apiClient.getDishes()]);
      setOrders(o);
      setDishes(d);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try { 
      await apiClient.updateOrderStatus(id, status); 
    } catch (err) { 
      alert('Ошибка при обновлении статуса'); 
    }
  };

  const handleToggleAvailability = async (dish: Dish) => {
    try {
      await apiClient.updateDishAvailability(dish.id, !dish.available);
    } catch (err) {
      alert('Ошибка стоп-листа');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setEditingDish(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    if (!editingDish.image) {
      alert('Пожалуйста, выберите фото для блюда');
      return;
    }
    
    setLoading(true);
    try {
      if (editingDish.id) {
        await apiClient.updateDish(editingDish.id, editingDish);
      } else {
        await apiClient.createDish(editingDish as Omit<Dish, 'id'>);
      }
      setIsDishModalOpen(false);
      setEditingDish(null);
      setImagePreview(null);
      loadData();
    } catch (err) {
      alert('Ошибка при сохранении блюда');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить это блюдо?')) return;
    try {
      await apiClient.deleteDish(id);
      loadData();
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('Удалить этот заказ из базы данных?')) return;
    try {
      await supabase.from('orders').delete().eq('id', id);
      loadData();
    } catch (err) {
      alert('Ошибка при удалении заказа');
    }
  };

  const stats = useMemo(() => {
    const dayOrders = orders.filter(o => o.created_at.startsWith(selectedDate));
    const revenue = dayOrders.reduce((acc, curr) => acc + curr.total_amount, 0);
    const completedRevenue = dayOrders
      .filter(o => o.status === OrderStatus.DELIVERED)
      .reduce((acc, curr) => acc + curr.total_amount, 0);
    
    return {
      count: dayOrders.length,
      revenue,
      completedRevenue,
      avgCheck: dayOrders.length > 0 ? revenue / dayOrders.length : 0,
      list: dayOrders
    };
  }, [orders, selectedDate]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'orders') return orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED);
    if (activeTab === 'history') return orders.filter(o => o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED);
    return [];
  }, [orders, activeTab]);

  const filteredDishes = useMemo(() => {
    if (activeTab === 'stop') return dishes.filter(d => !d.available);
    return dishes;
  }, [dishes, activeTab]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f9f3e9] flex flex-col items-center justify-center p-4">
        <XCircle size={64} className="text-red-300 mb-6" />
        <h2 className="text-3xl font-serif italic text-amber-950 text-center">Доступ ограничен</h2>
        <p className="text-amber-900/40 text-center mt-2 uppercase tracking-widest text-xs">Данная страница доступна только администраторам</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9] py-12 px-4 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black italic text-amber-950 flex items-center gap-3">
              АДМИН <Bell className="text-orange-500 animate-pulse" size={28} />
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mt-1">Панель управления заведением</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => setActiveTab('stats')}
               className={`p-4 rounded-2xl shadow-sm transition-all ${activeTab === 'stats' ? 'bg-[#3c1c0a] text-white' : 'bg-white text-orange-500/40'}`}
             >
               <TrendingUp size={24}/>
             </button>
             <button 
               onClick={loadData} 
               className="flex items-center gap-2 bg-white px-6 py-4 rounded-2xl shadow-sm text-amber-950 text-xs font-black uppercase tracking-[0.2em] hover:bg-amber-50 transition-colors"
             >
               <RefreshCw size={18} className={loading && activeTab !== 'stats' ? 'animate-spin' : ''}/> ОБНОВИТЬ
             </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-10 overflow-x-auto scrollbar-hide pb-2">
          {[
            { id: 'orders', label: `ЗАКАЗЫ (${orders.filter(o => o.status !== OrderStatus.DELIVERED).length})` },
            { id: 'history', label: 'ИСТОРИЯ' },
            { id: 'stop', label: `СТОП (${dishes.filter(d => !d.available).length})` },
            { id: 'menu', label: 'МЕНЮ' },
            { id: 'stats', label: 'АНАЛИТИКА' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all shadow-sm ${
                activeTab === tab.id ? 'bg-[#3c1c0a] text-white shadow-lg scale-105' : 'bg-white text-amber-950/30 hover:bg-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        {loading && activeTab !== 'stats' && !isDishModalOpen ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-orange-600 mb-4" size={48}/>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/20">Синхронизация данных...</p>
          </div>
        ) : activeTab === 'orders' || activeTab === 'history' ? (
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white/50 rounded-[3rem] p-20 text-center border-2 border-dashed border-amber-900/10">
                <Package className="mx-auto mb-4 text-amber-900/10" size={48} />
                <p className="text-amber-900/30 uppercase font-black tracking-widest text-xs italic">Нет подходящих заказов</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-serif font-black text-amber-950">#{String(order.id).slice(0, 3)}</span>
                      <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black shadow-sm border border-orange-200">{order.total_amount} ₽</span>
                      <span className="text-[10px] font-bold text-amber-950/20 uppercase tracking-widest">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-amber-950/60 leading-relaxed italic mb-1 flex items-center gap-2">
                        <MapPin size={14} className="text-orange-400" /> {order.delivery_address}
                      </p>
                      <p className="text-[11px] font-black text-amber-950/30 tracking-widest flex items-center gap-2">
                        <Phone size={14} /> {order.contact_phone}
                      </p>
                    </div>
                    {order.items && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {order.items.map((item, i) => (
                          <span key={i} className="text-[9px] bg-amber-50 text-amber-950/60 px-3 py-1 rounded-lg font-bold uppercase tracking-widest">
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-amber-900/5">
                    <div className="relative flex-grow md:flex-grow-0">
                      <select 
                        value={order.status} 
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="appearance-none w-full bg-amber-50 border-none rounded-2xl px-6 py-3.5 text-[10px] font-black uppercase text-amber-950/70 pr-12 shadow-inner focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="pending">Новый</option>
                        <option value="confirmed">Принят</option>
                        <option value="cooking">Кухня</option>
                        <option value="delivering">Путь</option>
                        <option value="delivered">Готов</option>
                        <option value="cancelled">Отмена</option>
                      </select>
                      <Bell className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                    </div>
                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="w-14 h-14 flex items-center justify-center bg-red-50 text-red-300 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash size={20} />
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center bg-[#3c1c0a] text-white rounded-2xl shadow-lg hover:bg-orange-600 transition-all">
                      <Eye size={22} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === 'stop' || activeTab === 'menu' ? (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif italic text-amber-950">
                {activeTab === 'menu' ? 'Всё меню' : 'Стоп-лист'}
              </h2>
              {activeTab === 'menu' && (
                <button 
                  onClick={() => { 
                    setEditingDish({ available: true }); 
                    setImagePreview(null);
                    setIsDishModalOpen(true); 
                  }}
                  className="bg-orange-600 text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center gap-2"
                >
                  <Plus size={18} /> Добавить блюдо
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDishes.length === 0 ? (
                <div className="col-span-full py-20 text-center italic text-amber-900/20 uppercase tracking-widest text-xs font-bold">Пусто</div>
              ) : (
                filteredDishes.map(dish => (
                  <div key={dish.id} className="bg-white rounded-[2.5rem] p-6 shadow-md border border-white flex flex-col group overflow-hidden relative">
                    <div className="relative h-44 rounded-3xl overflow-hidden mb-6">
                      <img src={dish.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={dish.name} />
                      <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl border-2 border-white/20 ${dish.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {dish.available ? 'Доступно' : 'В СТОПЕ'}
                      </div>
                    </div>
                    <div className="flex-grow space-y-2">
                       <div className="flex justify-between items-start">
                          <h4 className="font-serif italic text-xl text-amber-950 group-hover:text-orange-600 transition-colors">{dish.name}</h4>
                          <span className="text-orange-600 font-black text-lg">{dish.price} ₽</span>
                       </div>
                       <p className="text-[10px] text-amber-950/30 uppercase font-black tracking-widest">
                         {CATEGORIES.find(c => c.id === dish.category)?.label} • {dish.weight}
                       </p>
                    </div>
                    <div className="flex items-center gap-3 pt-6 mt-6 border-t border-amber-900/5">
                       <button 
                        onClick={() => handleToggleAvailability(dish)}
                        className={`flex-grow py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${dish.available ? 'bg-amber-100 text-amber-950/60' : 'bg-green-600 text-white shadow-lg'}`}
                       >
                          {dish.available ? 'В СТОП' : 'ВЕРНУТЬ'}
                       </button>
                       <button 
                        onClick={() => { 
                          setEditingDish(dish); 
                          setImagePreview(dish.image);
                          setIsDishModalOpen(true); 
                        }}
                        className="w-12 h-12 flex items-center justify-center bg-amber-50 text-amber-950 rounded-2xl hover:bg-[#3c1c0a] hover:text-white transition-all shadow-sm"
                       >
                         <Edit3 size={18} />
                       </button>
                       <button 
                        onClick={() => handleDeleteDish(dish.id)}
                        className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-300 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
             <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                   <div className="p-5 bg-orange-100 text-orange-600 rounded-[1.5rem] shadow-sm"><Calendar size={32} /></div>
                   <div>
                      <h4 className="text-2xl font-serif italic font-black text-amber-950">Аналитика по дням</h4>
                      <p className="text-[10px] text-amber-900/40 uppercase tracking-[0.2em] font-bold">Выберите дату для получения отчета</p>
                   </div>
                </div>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-amber-50 border-none rounded-full px-10 py-4 text-amber-950 font-black shadow-inner focus:ring-2 focus:ring-orange-500 text-sm tracking-widest"
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#3c1c0a] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute -right-10 -bottom-10 text-white/5 group-hover:scale-125 transition-transform duration-700"><DollarSign size={180} /></div>
                   <div className="relative z-10">
                      <div className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-3 font-black">Выручка (Грязная)</div>
                      <div className="text-6xl font-black text-orange-500 mb-3 tracking-tighter">{stats.revenue.toLocaleString()} ₽</div>
                      <div className="text-[10px] italic opacity-30 font-bold uppercase tracking-widest">Все заказы на {selectedDate}</div>
                   </div>
                </div>
                
                <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white relative overflow-hidden group">
                   <div className="absolute -right-10 -bottom-10 text-amber-50 group-hover:scale-125 transition-transform duration-700"><ShoppingBag size={180} /></div>
                   <div className="relative z-10">
                      <div className="text-[10px] uppercase tracking-[0.4em] text-amber-900/30 mb-3 font-black">Кол-во заказов</div>
                      <div className="text-6xl font-black text-amber-950 mb-3 tracking-tighter">{stats.count}</div>
                      <div className="text-[10px] italic text-amber-900/30 font-bold uppercase tracking-widest">Успешных и новых сегодня</div>
                   </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white relative overflow-hidden group">
                   <div className="absolute -right-10 -bottom-10 text-amber-50 group-hover:scale-125 transition-transform duration-700"><CheckCircle size={180} /></div>
                   <div className="relative z-10">
                      <div className="text-[10px] uppercase tracking-[0.4em] text-amber-900/30 mb-3 font-black">Доставлено на сумму</div>
                      <div className="text-6xl font-black text-amber-950 mb-3 tracking-tighter">{stats.completedRevenue.toLocaleString()} ₽</div>
                      <div className="text-[10px] italic text-amber-900/30 font-bold uppercase tracking-widest">Завершенные чеки</div>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-white overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                   <h4 className="text-3xl font-serif italic font-black text-amber-950">Детализация за {new Date(selectedDate).toLocaleDateString()}</h4>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-amber-50 px-4 py-2 rounded-full text-amber-900/40">ИТОГО: {stats.count}</div>
                </div>
                
                {stats.list.length > 0 ? (
                  <div className="divide-y divide-amber-900/5">
                    {stats.list.map(o => (
                      <div key={o.id} className="py-6 flex justify-between items-center group">
                         <div className="flex gap-6 items-center">
                            <span className="text-xs font-black text-amber-950/20 uppercase tracking-widest">#{String(o.id).slice(0, 5)}</span>
                            <div className="flex flex-col">
                               <span className="text-sm font-black text-amber-950">{new Date(o.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                               <span className="text-[10px] italic text-amber-950/40 uppercase tracking-widest">{o.contact_phone}</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="font-black text-orange-600 text-lg">{o.total_amount} ₽</div>
                            <div className={`text-[8px] font-black uppercase tracking-widest ${o.status === OrderStatus.DELIVERED ? 'text-green-500' : 'text-amber-400'}`}>
                               {o.status}
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                     <Package className="mx-auto text-amber-900/5 mb-4" size={64} />
                     <p className="text-amber-900/30 italic text-sm font-bold uppercase tracking-widest">В этот день не было заказов</p>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* Dish Add/Edit Modal */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
           <form 
            onSubmit={handleSaveDish}
            className="bg-[#f9f3e9] w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
           >
              <button 
                type="button"
                onClick={() => setIsDishModalOpen(false)}
                className="absolute top-10 right-10 text-amber-950/20 hover:text-amber-950 transition-colors"
              >
                <XCircle size={36} />
              </button>

              <h2 className="text-4xl font-serif italic font-black text-amber-950 mb-10">
                {editingDish?.id ? 'РЕДАКТОР БЛЮДА' : 'НОВОЕ БЛЮДО'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Image Upload Area */}
                 <div className="col-span-1 md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-amber-950 uppercase tracking-[0.2em] block px-4">Фотография блюда</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative w-full h-56 bg-white rounded-3xl border-4 border-dashed border-amber-900/5 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/30 transition-all overflow-hidden"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                             <Upload className="text-white" size={32} />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-amber-900/20 group-hover:text-orange-500 transition-colors">
                           <ImageIcon size={48} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Нажмите для загрузки</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-amber-950 uppercase tracking-[0.2em] block px-4">Название блюда</label>
                    <input 
                      required 
                      value={editingDish?.name || ''} 
                      onChange={e => setEditingDish({...editingDish, name: e.target.value})}
                      className="w-full bg-white rounded-3xl py-4.5 px-8 border-none shadow-sm text-sm italic font-bold placeholder-amber-900/10 focus:ring-2 focus:ring-orange-500" 
                      placeholder="Шурпа из говядины"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-amber-950 uppercase tracking-[0.2em] block px-4">Категория</label>
                    <select 
                      required 
                      value={editingDish?.category || Category.MAIN}
                      onChange={e => setEditingDish({...editingDish, category: e.target.value as Category})}
                      className="w-full bg-white rounded-3xl py-4.5 px-8 border-none shadow-sm text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-500"
                    >
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-amber-950 uppercase tracking-[0.2em] block px-4">Цена (₽)</label>
                    <input 
                      required 
                      type="number"
                      value={editingDish?.price || ''} 
                      onChange={e => setEditingDish({...editingDish, price: Number(e.target.value)})}
                      className="w-full bg-white rounded-3xl py-4.5 px-8 border-none shadow-sm text-lg font-black text-orange-600 focus:ring-2 focus:ring-orange-500" 
                      placeholder="450"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-amber-950 uppercase tracking-[0.2em] block px-4">Вес (г/мл)</label>
                    <input 
                      required 
                      value={editingDish?.weight || ''} 
                      onChange={e => setEditingDish({...editingDish, weight: e.target.value})}
                      className="w-full bg-white rounded-3xl py-4.5 px-8 border-none shadow-sm text-sm font-bold italic focus:ring-2 focus:ring-orange-500" 
                      placeholder="350г"
                    />
                 </div>
                 <div className="col-span-1 md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-amber-950 uppercase tracking-[0.2em] block px-4">Описание вкуса</label>
                    <textarea 
                      required 
                      value={editingDish?.description || ''} 
                      onChange={e => setEditingDish({...editingDish, description: e.target.value})}
                      rows={3}
                      className="w-full bg-white rounded-3xl py-4.5 px-8 border-none shadow-sm text-sm italic leading-relaxed focus:ring-2 focus:ring-orange-500" 
                      placeholder="Наваристый бульон, отборная говядина..."
                    />
                 </div>
                 <div className="col-span-1 md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-amber-950 uppercase tracking-[0.2em] block px-4">Состав</label>
                    <input 
                      value={editingDish?.ingredients || ''} 
                      onChange={e => setEditingDish({...editingDish, ingredients: e.target.value})}
                      className="w-full bg-white rounded-3xl py-4.5 px-8 border-none shadow-sm text-sm italic focus:ring-2 focus:ring-orange-500" 
                      placeholder="Говядина, картофель, лук..."
                    />
                 </div>
              </div>

              <div className="mt-12 flex gap-6">
                 <button 
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="flex-1 bg-white text-amber-950/40 py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-white/80 transition-all shadow-sm border border-amber-950/5"
                 >
                   ОТМЕНА
                 </button>
                 <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#3c1c0a] text-white py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-600 shadow-2xl shadow-amber-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} СОХРАНИТЬ
                 </button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};
