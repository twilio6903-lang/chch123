
import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
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

const router = createHashRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
  },
  {
    path: "/cart",
    element: <Layout><Cart /></Layout>,
  },
  {
    path: "/profile",
    element: <Layout><Profile /></Layout>,
  },
  {
    path: "/admin",
    element: <Layout><Admin /></Layout>,
  },
  {
    path: "/delivery",
    element: <Layout><Delivery /></Layout>,
  },
  {
    path: "/contacts",
    element: <Layout><Contacts /></Layout>,
  },
  {
    path: "/order-success",
    element: <Layout><OrderSuccess /></Layout>,
  },
  {
    path: "/privacy",
    element: <Layout><div className="p-20 max-w-2xl mx-auto italic text-amber-900/60 leading-relaxed">Политика конфиденциальности... (здесь будет текст соглашения)</div></Layout>,
  },
  {
    path: "/terms",
    element: <Layout><div className="p-20 max-w-2xl mx-auto italic text-amber-900/60 leading-relaxed">Пользовательское соглашение... (здесь будут условия сервиса)</div></Layout>,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }
});

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
