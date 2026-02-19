
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
   * Получение ссылки на оплату ЮKassa.
   * Ошибка 400 для ИП часто связана с отсутствием description или неверным форматом JSON.
   * Ошибка 'Failed to fetch' означает, что Edge Function недоступна или блокируется.
   */
  async getPaymentLink(orderId: string, amount: number) {
    const SHOP_ID = '1271098';
    const formattedSum = amount.toFixed(2);
    const description = `Оплата заказа №${orderId.slice(0, 8)} в Чайхана Жулебино`;
    
    const base = window.location.origin + window.location.pathname;
    const cleanBase = base.endsWith('/') ? base : base + '/';
    const returnUrl = `${cleanBase}#/order-success?orderId=${orderId}`;
    
    // Пытаемся вызвать Edge Function
    try {
      const response = await supabase.functions.invoke('yookassa-payment', {
        body: { 
          orderId, 
          amount: {
            value: formattedSum,
            currency: 'RUB'
          },
          description: description,
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: returnUrl
          },
          metadata: {
            order_id: orderId
          }
        },
      });

      // В случае успеха Edge Function возвращает объект с confirmation_url
      if (response.data?.confirmation_url) {
        return response.data.confirmation_url;
      }

      if (response.error) {
        console.error('Edge Function Error Response:', response.error);
        // Если функция вернула ошибку (например 400), выбрасываем её для перехода в catch
        throw response.error;
      }
    } catch (err: any) {
      console.warn('Edge Function unreachable or failed, falling back to direct contract link:', err.message || err);
      
      // РЕЗЕРВНЫЙ ВАРИАНТ: Прямая контрактная ссылка, если Edge Function не работает ('Failed to fetch')
      // Для ИП Садыкова М.М. этот метод может требовать настройки "Платежи по ссылке" в ЛК ЮKassa
      const fallbackUrl = new URL('https://yookassa.ru/checkout/payments/v2/contract');
      fallbackUrl.searchParams.append('shopId', SHOP_ID);
      fallbackUrl.searchParams.append('sum', formattedSum);
      fallbackUrl.searchParams.append('customerNumber', orderId);
      fallbackUrl.searchParams.append('shopSuccessURL', returnUrl);
      
      return fallbackUrl.toString();
    }
    
    throw new Error('Не удалось сформировать ссылку на оплату');
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
