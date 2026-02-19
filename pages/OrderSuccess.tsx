
import React, { useEffect } from 'react';
import { CheckCircle, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const OrderSuccess: React.FC = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Очищаем корзину окончательно при попадании на эту страницу
    clearCart();
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-[#f9f3e9]">
      <div className="max-w-md w-full bg-white rounded-[4rem] p-12 shadow-2xl border border-white text-center animate-in zoom-in-95 duration-500">
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-green-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-200">
            <CheckCircle size={48} />
          </div>
        </div>

        <h1 className="text-4xl font-serif italic font-black text-amber-950 mb-4">Спасибо за заказ!</h1>
        <p className="text-amber-900/40 text-sm mb-2 uppercase tracking-widest font-bold">
          Заказ №{orderId ? orderId.slice(0, 8).toUpperCase() : 'ПРИНЯТ'}
        </p>
        <p className="text-amber-950/60 italic text-sm leading-relaxed mb-10">
          Мы уже начали готовить ваше блюдо. <br/> Наш курьер прибудет в течение 45-60 минут.
        </p>

        <div className="space-y-4">
          <Link 
            to="/profile" 
            className="w-full flex items-center justify-center gap-2 bg-amber-950 text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 transition-all shadow-lg"
          >
            Статус заказа <ArrowRight size={16} />
          </Link>
          <Link 
            to="/" 
            className="w-full flex items-center justify-center gap-2 bg-amber-50 text-amber-950 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-amber-100 transition-all"
          >
            Вернуться в меню
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-amber-900/20 italic text-xs">
          <Heart size={14} className="fill-current" /> Готовим с любовью
        </div>
      </div>
    </div>
  );
};
