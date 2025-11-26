import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { authApi } from '../services/endpoints';
import { clearSession, loadSession, saveSession } from '../services/authStorage';
import { setAuthToken } from '../services/api';
import { AuthResponse, User } from '../types/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const session = await loadSession();
        if (session) {
          setUser(session.user);
          setToken(session.token);
          setAuthToken(session.token);
        }
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, []);

  const persistSession = async (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.token);
    setAuthToken(data.token);
    await saveSession(data);
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await authApi.login(email, password);
      await persistSession(data);
    } catch (error: any) {
      Alert.alert('Erro ao entrar', error?.response?.data?.message || 'Verifique suas credenciais');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await authApi.register(name, email, password);
      await persistSession(data);
    } catch (error: any) {
      Alert.alert('Erro ao criar conta', error?.response?.data?.message || 'Não foi possível criar a conta');
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(undefined);
    await clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
