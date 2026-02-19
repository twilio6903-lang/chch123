
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Delivery } from './pages/Delivery';
import { Contacts } from './pages/Contacts';
import { OrderSuccess } from './pages/OrderSuccess';

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
