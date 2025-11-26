import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const baseApiUrl =
  (Constants.expoConfig?.extra as { apiUrl?: string })?.apiUrl ||
  Platform.select({
    android: 'http://10.0.2.2:3333',
    ios: 'http://localhost:3333',
    default: 'http://localhost:3333',
  });

const api = axios.create({
  baseURL: `${baseApiUrl}/api`,
});

let authToken: string | undefined;

export const setAuthToken = (token?: string) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
