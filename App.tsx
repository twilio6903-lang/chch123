
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Layout } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { Cart } from './pages/Cart.tsx';
import { Profile } from './pages/Profile.tsx';
import { Admin } from './pages/Admin.tsx';
import { Delivery } from './pages/Delivery.tsx';
import { Contacts } from './pages/Contacts.tsx';
import { OrderSuccess } from './pages/OrderSuccess.tsx';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/privacy" element={<div className="p-20 max-w-2xl mx-auto italic text-amber-900/60 leading-relaxed">Политика конфиденциальности... (здесь будет текст соглашения)</div>} />
              <Route path="/terms" element={<div className="p-20 max-w-2xl mx-auto italic text-amber-900/60 leading-relaxed">Пользовательское соглашение... (здесь будут условия сервиса)</div>} />
            </Routes>
          </Layout>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
