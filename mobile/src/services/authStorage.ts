import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types/api';

const TOKEN_KEY = '@bookshelf/token';
const USER_KEY = '@bookshelf/user';

export const saveSession = async (data: AuthResponse) => {
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, data.token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user)),
  ]);
};

export const loadSession = async () => {
  const [token, userJson] = await Promise.all([AsyncStorage.getItem(TOKEN_KEY), AsyncStorage.getItem(USER_KEY)]);
  if (!token || !userJson) return null;
  return { token, user: JSON.parse(userJson) } as AuthResponse;
};

export const clearSession = async () => {
  await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
};
