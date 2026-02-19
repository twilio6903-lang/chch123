
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, Phone, MapPin, Instagram, CreditCard, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LEGAL_INFO } from '../constants';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { itemCount, totalPrice } = useCart();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f3e9]">
      {/* Header based on Screenshot */}
      <header className="sticky top-0 z-50 bg-[#3c1c0a] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <MenuIcon size={24} />
              </button>
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Logo className="scale-[0.6]" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Чайхана Жулебино</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <Link to="/cart" className="p-3 hover:bg-white/10 rounded-xl transition-colors relative">
                <ShoppingCart size={22} />
                {itemCount > 0 && <span className="absolute top-2 right-2 bg-orange-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black shadow-lg">{itemCount}</span>}
              </Link>
              <Link to="/profile" className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                <User size={22} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-[#f9f3e9] p-8 flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-12">
              <Logo className="scale-75" />
              <button onClick={() => setSidebarOpen(false)} className="text-amber-950 p-2"><X /></button>
            </div>
            <nav className="flex flex-col space-y-8 text-sm font-bold uppercase tracking-[0.2em] text-amber-950">
              <Link to="/" onClick={() => setSidebarOpen(false)}>МЕНЮ</Link>
              <Link to="/delivery" onClick={() => setSidebarOpen(false)}>ДОСТАВКА</Link>
              <Link to="/contacts" onClick={() => setSidebarOpen(false)}>КОНТАКТЫ</Link>
              {user?.role === 'admin' && <Link to="/admin" onClick={() => setSidebarOpen(false)} className="text-orange-600">АДМИН-ПАНЕЛЬ</Link>}
            </nav>
            <div className="mt-auto border-t border-amber-900/10 pt-10 space-y-4">
              <div className="flex items-center gap-3 text-amber-950 font-black"><Phone size={18} /> {LEGAL_INFO.phone}</div>
              <p className="text-[10px] text-amber-900/40 uppercase tracking-widest font-bold">Работаем ежедневно<br/>с 10:00 до 22:00</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer based on Screenshot */}
      <footer className="bg-[#3c1c0a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <Logo className="scale-75 brightness-0 invert" />
            </div>
            <h4 className="text-xl font-serif italic font-black uppercase tracking-widest">Чайхана Жулебино</h4>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-bold uppercase tracking-[0.3em] mb-16 opacity-60">
            <Link to="/delivery" className="hover:text-orange-500 transition-colors">Доставка</Link>
            <Link to="/contacts" className="hover:text-orange-500 transition-colors">Контакты</Link>
            <Link to="/terms" className="hover:text-orange-500 transition-colors">Соглашение</Link>
            <Link to="/privacy" className="hover:text-orange-500 transition-colors">Приватность</Link>
          </nav>

          <div className="space-y-4 opacity-30 text-[9px] uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
            <p>© {new Date().getFullYear()} ЧАЙХАНА ЖУЛЕБИНО. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
            <p>{LEGAL_INFO.owner}<br/>ИНН {LEGAL_INFO.inn} | ОГРНИП {LEGAL_INFO.ogrnip}</p>
            <p className="italic font-serif tracking-widest mt-6">РАБОТАЕМ С ДУШОЙ. ГОТОВИМ С ЛЮБОВЬЮ.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
