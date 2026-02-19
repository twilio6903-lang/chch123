
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
   * Если Edge Function не развернута, используется прямой редирект на форму платежа.
   */
  async getPaymentLink(orderId: string, amount: number, description: string) {
    const SHOP_ID = '1271098';
    
    try {
      // 1. Пытаемся вызвать Edge Function (лучший способ)
      const { data, error } = await supabase.functions.invoke('yookassa-payment', {
        body: { orderId, amount, description },
      });

      if (!error && data?.confirmation_url) {
        return data.confirmation_url;
      }
      
      console.warn('Edge Function yookassa-payment not found or failed. Falling back to direct link.');
    } catch (err) {
      console.warn('Network error while calling Edge Function. Falling back to direct link.');
    }

    // 2. Резервный способ (Fallback): Прямая ссылка на контракт ЮKassa
    // customerNumber - это ID заказа, sum - сумма.
    // Это позволит пользователю оплатить заказ даже без Edge Function.
    return `https://yoomoney.ru/checkout/payments/v2/contract?shopId=${SHOP_ID}&sum=${amount}&customerNumber=${orderId}`;
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
