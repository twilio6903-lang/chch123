
import React from 'react';
import { Category, Dish } from './types';

export const MIN_ORDER_AMOUNT = 1200;
export const FREE_DELIVERY_THRESHOLD = 3000;
export const DELIVERY_FEE = 150;

export const CATEGORIES = [
  { id: Category.MAIN, label: 'ОСНОВНЫЕ', icon: '🍲' },
  { id: Category.SOUPS, label: 'СУПЫ', icon: '🥣' },
  { id: Category.SALADS, label: 'САЛАТЫ', icon: '🥗' },
  { id: Category.BAKERY, label: 'ВЫПЕЧКА', icon: '🥐' },
  { id: Category.DRINKS, label: 'НАПИТКИ', icon: '🥤' },
];

export const LEGAL_INFO = {
  owner: 'Индивидуальный предприниматель Садыкова Махфуза Маъруфовна',
  inn: '7707083893',
  ogrnip: '325508100324129',
  address: 'Москва, Жулебинский бульвар, д. 26',
  phone: '+7 (925) 111-60-74',
  email: 'zhulebino.teahouse@gmail.com',
  workingHours: 'Ежедневно: 10:00 — 22:00'
};
