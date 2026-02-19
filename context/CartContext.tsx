
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Dish } from '../types';
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '../constants';

interface CartContextType {
  items: CartItem[];
  addItem: (dish: Dish) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  deliveryCost: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (dish: Dish) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === dish.id);
      if (existing) {
        return prev.map(i => i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const removeItem = (dishId: string) => {
    setItems(prev => prev.filter(i => i.id !== dishId));
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === dishId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const deliveryCost = totalPrice >= FREE_DELIVERY_THRESHOLD || totalPrice === 0 ? 0 : DELIVERY_FEE;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalPrice, deliveryCost, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
