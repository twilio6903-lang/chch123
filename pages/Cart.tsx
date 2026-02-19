
import React, { useState } from 'react';
import { ShoppingBag, Trash2, Minus, Plus, ChevronLeft, CreditCard, Info, MapPin, Loader2, Wallet, Banknote, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MIN_ORDER_AMOUNT, FREE_DELIVERY_THRESHOLD } from '../constants';
import { apiClient } from '../apiClient';
import { OrderStatus, PaymentMethod } from '../types';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, totalPrice, deliveryCost, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: '',
    street: user?.address || '',
    house: '',
    entrance: '',
    floor: '',
    apartment: '',
    intercom: '',
    comment: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalPrice < MIN_ORDER_AMOUNT) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const addressString = `${formData.street}, д. ${formData.house}, под. ${formData.entrance}, эт. ${formData.floor}, кв. ${formData.apartment}`;
      const total = totalPrice + deliveryCost;

      // 1. Создаем заказ в базе
      const order = await apiClient.createOrder({
        user_id: user?.id || null as any,
        items: items,
        total_amount: total,
        status: OrderStatus.PENDING,
        delivery_address: addressString,
        contact_phone: formData.phone,
        comment: formData.comment,
        payment_status: 'unpaid',
        payment_method: paymentMethod
      });

      // 2. Логика оплаты
      if (paymentMethod === 'online') {
        const confirmationUrl = await apiClient.getPaymentLink(
          order.id, 
          total, 
          `Заказ №${order.id} в Чайхана Жулебино`
        );
        
        // Очищаем корзину перед уходом на страницу оплаты
        clearCart();
        
        // Редирект на ЮKassa (через Edge Function илиFallback)
        window.location.href = confirmationUrl;
        return; 
      } else {
        alert('Заказ успешно оформлен! Мы перезвоним вам в течение 5 минут.');
        clearCart();
        navigate('/profile');
      }
    } catch (err: any) {
      console.error('Order Submission Error:', err);
      setErrorMessage(err.message || 'Ошибка при оформлении заказа. Попробуйте еще раз или свяжитесь с нами.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block p-12 bg-white rounded-full shadow-xl mb-8">
          <ShoppingBag size={64} className="text-amber-100" />
        </div>
        <h2 className="text-4xl font-serif italic text-amber-950 mb-4">Ваша корзина пуста</h2>
        <Link to="/" className="inline-block bg-amber-950 text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-orange-600 transition-colors">
          В меню
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/" className="p-3 bg-white rounded-full text-amber-950 hover:bg-amber-100 transition-colors shadow-sm">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-4xl lg:text-5xl font-serif italic text-amber-950">Корзина</h1>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] mb-8 flex items-start gap-4 text-red-600 animate-in fade-in slide-in-from-top-4">
           <AlertTriangle className="flex-shrink-0" size={24} />
           <div>
              <p className="font-bold text-sm italic mb-1">Возникла проблема:</p>
              <p className="text-xs opacity-70 leading-relaxed">{errorMessage}</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
            <div className="divide-y divide-amber-900/5">
              {items.map(item => (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-xl font-serif italic text-amber-950 mb-1">{item.name}</h3>
                    <p className="text-amber-900/40 text-xs uppercase tracking-widest">{item.weight}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-amber-50 rounded-full p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-amber-950"><Minus size={16} /></button>
                      <span className="w-8 text-center font-bold text-amber-950">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-amber-950"><Plus size={16} /></button>
                    </div>
                    <div className="w-20 text-right font-bold text-amber-950">{item.price * item.quantity} ₽</div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-300 hover:text-red-500"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-orange-50 rounded-[2rem] p-6 flex items-start gap-4 text-orange-800">
            <Info className="flex-shrink-0 mt-1" size={20} />
            <div className="text-sm">
              <p className="font-bold mb-1 uppercase tracking-widest">Бесплатно от {FREE_DELIVERY_THRESHOLD} ₽</p>
              <p className="opacity-80 italic">Минимальный заказ — {MIN_ORDER_AMOUNT} ₽.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-10 shadow-2xl border border-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-serif italic text-amber-950 mb-8 flex items-center gap-3">
                <MapPin size={24} className="text-orange-600" /> Доставка
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input required name="name" placeholder="Имя" value={formData.name} onChange={handleInputChange} className="w-full bg-amber-50 rounded-2xl py-4 px-6 text-amber-950 shadow-inner outline-none focus:ring-2 focus:ring-orange-500/20" />
                  <input required name="phone" placeholder="Телефон" value={formData.phone} onChange={handleInputChange} className="w-full bg-amber-50 rounded-2xl py-4 px-6 text-amber-950 shadow-inner outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input required name="street" placeholder="Улица" value={formData.street} onChange={handleInputChange} className="col-span-2 w-full bg-amber-50 rounded-2xl py-4 px-6 shadow-inner outline-none focus:ring-2 focus:ring-orange-500/20" />
                  <input required name="house" placeholder="Дом" value={formData.house} onChange={handleInputChange} className="bg-amber-50 rounded-2xl py-4 px-6 shadow-inner outline-none focus:ring-2 focus:ring-orange-500/20" />
                  <input name="apartment" placeholder="Кв" value={formData.apartment} onChange={handleInputChange} className="bg-amber-50 rounded-2xl py-4 px-6 shadow-inner outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                
                <textarea name="comment" placeholder="Комментарий к заказу" value={formData.comment} onChange={handleInputChange} rows={2} className="w-full bg-amber-50 rounded-2xl py-4 px-6 shadow-inner text-sm outline-none focus:ring-2 focus:ring-orange-500/20" />

                <div className="space-y-4 pt-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-950/40 ml-4">Способ оплаты</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${paymentMethod === 'online' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-amber-900/5 bg-amber-50/30 text-amber-900/40'}`}
                    >
                      <Wallet size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Картой онлайн</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-amber-900/5 bg-amber-50/30 text-amber-900/40'}`}
                    >
                      <Banknote size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">При получении</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-4 border-t border-amber-950/10 pt-8">
                <div className="flex justify-between text-amber-950/60 uppercase tracking-widest text-xs font-bold">
                  <span>Блюда</span><span>{totalPrice} ₽</span>
                </div>
                <div className="flex justify-between text-amber-950/60 uppercase tracking-widest text-xs font-bold">
                  <span>Доставка</span><span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
                </div>
                <div className="flex justify-between text-amber-950 text-2xl font-serif italic py-2 border-y border-amber-950/5">
                  <span>Итого:</span><span className="text-orange-600 font-bold">{totalPrice + deliveryCost} ₽</span>
                </div>
              </div>

              <div className="mt-10">
                <button
                  disabled={isSubmitting || totalPrice < MIN_ORDER_AMOUNT}
                  className="w-full bg-amber-950 text-white py-6 rounded-full font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" /> Подключение...</>
                  ) : (
                    <><CreditCard size={20} /> {paymentMethod === 'online' ? 'Оплатить картой' : 'Заказать'}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
