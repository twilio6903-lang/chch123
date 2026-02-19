
import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Package, Clock, CheckCircle, MapPin, LogOut, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../apiClient';
import { Order, OrderStatus } from '../types';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, login, register, logout, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      apiClient.getMyOrders(user.id)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setOrdersLoading(false));
    }
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, fullName, address);
        alert('Регистрация прошла успешно! Теперь вы можете войти.');
        setAuthMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при аутентификации');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-amber-950 italic">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="animate-pulse tracking-widest uppercase text-xs font-bold">Загружаем данные профиля...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-12 lg:py-24 px-4">
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex bg-amber-50 p-1 rounded-full mb-10 w-fit mx-auto shadow-inner">
               <button 
                onClick={() => { setAuthMode('login'); setError(null); }}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  authMode === 'login' ? 'bg-amber-950 text-white shadow-lg' : 'text-amber-900/40 hover:bg-amber-100'
                }`}
               >
                 Вход
               </button>
               <button 
                onClick={() => { setAuthMode('register'); setError(null); }}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  authMode === 'register' ? 'bg-amber-950 text-white shadow-lg' : 'text-amber-900/40 hover:bg-amber-100'
                }`}
               >
                 Регистрация
               </button>
            </div>

            <h2 className="text-4xl font-serif italic text-amber-950 text-center mb-2">
              {authMode === 'login' ? 'С возвращением!' : 'Стать гостем'}
            </h2>
            <p className="text-amber-900/40 text-center text-sm mb-10 italic">
              {authMode === 'login' ? 'Войдите, чтобы увидеть свои заказы' : 'Заполните данные для быстрой доставки'}
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm italic">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              {authMode === 'register' && (
                <>
                  <div className="text-left">
                    <label className="text-[10px] font-bold text-amber-950 uppercase tracking-[0.2em] mb-2 block px-2">Полное имя</label>
                    <input 
                      type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full bg-amber-50 border-none rounded-2xl py-4 px-6 text-amber-950 shadow-inner focus:ring-2 focus:ring-orange-500" 
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div className="text-left">
                    <label className="text-[10px] font-bold text-amber-950 uppercase tracking-[0.2em] mb-2 block px-2">Основной адрес доставки</label>
                    <input 
                      type="text" required value={address} onChange={e => setAddress(e.target.value)}
                      className="w-full bg-amber-50 border-none rounded-2xl py-4 px-6 text-amber-950 shadow-inner focus:ring-2 focus:ring-orange-500" 
                      placeholder="ул. Жулебинская, д. 10"
                    />
                  </div>
                </>
              )}
              
              <div className="text-left">
                <label className="text-[10px] font-bold text-amber-950 uppercase tracking-[0.2em] mb-2 block px-2">E-mail</label>
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-amber-50 border-none rounded-2xl py-4 px-6 text-amber-950 shadow-inner focus:ring-2 focus:ring-orange-500" 
                  placeholder="name@example.com"
                />
              </div>
              <div className="text-left">
                <label className="text-[10px] font-bold text-amber-950 uppercase tracking-[0.2em] mb-2 block px-2">Пароль</label>
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-amber-50 border-none rounded-2xl py-4 px-6 text-amber-950 shadow-inner focus:ring-2 focus:ring-orange-500" 
                  placeholder="••••••••"
                />
              </div>
              
              <button 
                disabled={isSubmitting}
                className="w-full bg-amber-950 text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] shadow-xl shadow-amber-950/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-8"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (authMode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />)}
                {authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* User Info Card */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white sticky top-28 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
             
             <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-amber-950 rounded-full flex items-center justify-center text-white text-3xl font-serif italic mx-auto mb-6 shadow-xl border-4 border-amber-50">
                    {user.full_name?.charAt(0) || 'U'}
                </div>
                <h3 className="text-3xl font-serif italic text-amber-950 mb-1">{user.full_name}</h3>
                <p className="text-amber-900/40 text-xs uppercase tracking-widest mb-10">{user.email}</p>
                
                <div className="space-y-5 pt-8 border-t border-amber-900/5 text-left">
                    <div>
                      <span className="text-[10px] font-bold text-amber-950/30 uppercase tracking-[0.2em] block mb-2">Адрес по умолчанию</span>
                      <div className="flex items-start gap-3 text-amber-950/70 text-sm italic">
                        <MapPin size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                        {user.address || 'Адрес не указан'}
                      </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-amber-900/5">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 text-red-300 hover:text-red-500 text-sm font-bold uppercase tracking-widest transition-colors"
                    >
                      <LogOut size={18} /> Выйти из аккаунта
                    </button>
                </div>
             </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-serif italic text-amber-950 flex items-center gap-4">
              <Package size={32} className="text-orange-600" /> Мои заказы
            </h2>
            <Link to="/" className="text-[10px] font-bold text-orange-600 uppercase tracking-widest border-b-2 border-orange-600/20 hover:border-orange-600 transition-all">
              Новый заказ
            </Link>
          </div>
          
          {ordersLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-600" /></div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-md border border-white hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-bold text-amber-950/30 uppercase tracking-widest">№ {String(order.id).slice(0, 8).toUpperCase()}</span>
                        <span className="w-1 h-1 bg-amber-950/20 rounded-full"></span>
                        <span className="text-[10px] font-bold text-amber-950/30 uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <h4 className="text-lg text-amber-950 font-serif italic group-hover:text-orange-600 transition-colors">
                        {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                      </h4>
                    </div>
                    
                    <div className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                      order.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {order.status === OrderStatus.DELIVERED ? <CheckCircle size={14} /> : <Clock size={14} className="animate-pulse" />}
                      {
                        order.status === OrderStatus.PENDING ? 'Новый' :
                        order.status === OrderStatus.CONFIRMED ? 'Подтвержден' :
                        order.status === OrderStatus.COOKING ? 'Готовится' :
                        order.status === OrderStatus.DELIVERING ? 'В пути' :
                        order.status === OrderStatus.DELIVERED ? 'Доставлен' : 'Отменен'
                      }
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-amber-900/5 gap-4">
                    <div className="flex items-center gap-2 text-amber-950/40 text-xs italic">
                      <MapPin size={14} /> {order.delivery_address.slice(0, 40)}...
                    </div>
                    <div className="text-2xl font-bold text-amber-950">{order.total_amount} ₽</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-white">
              <div className="inline-block p-10 bg-amber-50 rounded-full mb-6">
                <ShoppingBag size={48} className="text-amber-200" />
              </div>
              <h3 className="text-2xl font-serif italic text-amber-950 mb-4">У вас пока нет заказов</h3>
              <p className="text-amber-900/40 text-sm max-w-xs mx-auto mb-10 italic leading-relaxed">
                Самое время попробовать наш знаменитый плов или ароматную шурпу!
              </p>
              <Link to="/" className="inline-block bg-amber-950 text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all">
                Выбрать блюда
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
