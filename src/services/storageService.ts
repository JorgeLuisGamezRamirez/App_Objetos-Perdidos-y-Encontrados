import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types';

const ITEMS_KEY = '@app_items_key';
const USER_KEY = '@app_user_key';

export const storageService = {
  // Guardar usuario en sesión
  saveUser: async (user: { uid: string; displayName: string; email: string }) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Obtener usuario actual
  getUser: async () => {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Eliminar usuario (Cerrar Sesión)
  clearUser: async () => {
    await AsyncStorage.removeItem(USER_KEY);
  },

  // Obtener todos los objetos
  getItems: async (): Promise<Item[]> => {
    const data = await AsyncStorage.getItem(ITEMS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Guardar un nuevo objeto
  addItem: async (newItem: Omit<Item, 'id' | 'createdAt'>) => {
    const items = await storageService.getItems();
    const itemToSave: Item = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    items.unshift(itemToSave);
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    return itemToSave;
  },

  // Marcar como resuelto / eliminado
  toggleStatus: async (itemId: string) => {
    const items = await storageService.getItems();
    const updated = items.map(item => {
      if (item.id === itemId) {
        return { ...item, status: item.status === 'pending' ? 'resolved' : 'pending' as any };
      }
      return item;
    });
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(updated));
  }
};
