
import { supabase } from './lib/supabase';
import { Dish, Order, OrderStatus, Category, Profile } from './types';

export const apiClient = {
  // Dishes
  async getDishes(): Promise<Dish[]> {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('category');
    
    if (error) throw error;
    return data as Dish[];
  },

  async createDish(dish: Omit<Dish, 'id'>) {
    const { data, error } = await supabase
      .from('dishes')
      .insert([dish])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateDish(id: string, updates: Partial<Dish>) {
    const { data, error } = await supabase
      .from('dishes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteDish(id: string) {
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async updateDishAvailability(id: string, available: boolean) {
    const { error } = await supabase
      .from('dishes')
      .update({ available })
      .eq('id', id);
    if (error) throw error;
  },

  // Orders & Payments
  async createOrder(order: Omit<Order, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Получение ссылки на оплату.
   * Исправлен формат для Simple Integration ЮKassa.
   */
  async getPaymentLink(orderId: string, amount: number) {
    const SHOP_ID = '1271098';
    // URL вашего сайта (автоматически определяется)
    const baseUrl = window.location.origin + window.location.pathname;
    const returnUrl = `${baseUrl}#/order-success?orderId=${orderId}`;
    
    try {
      // Пытаемся вызвать Edge Function
      const { data, error } = await supabase.functions.invoke('yookassa-payment', {
        body: { orderId, amount, returnUrl },
      });

      if (!error && data?.confirmation_url) {
        return data.confirmation_url;
      }
    } catch (err) {
      console.warn('Edge Function fallback');
    }

    // Резервный способ: Конструктор ссылки для Простой Оплаты
    // Используем проверенный формат для shopId
    return `https://yookassa.ru/integration/simple/checkout?shopId=${SHOP_ID}&sum=${amount}&customerNumber=${orderId}&shopSuccessURL=${encodeURIComponent(returnUrl)}`;
  },

  async getMyOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Order[];
  },

  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Order[];
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw error;
  },

  // Profiles
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) return null;
    return data;
  },

  async upsertProfile(profile: Partial<Profile> & { id: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
