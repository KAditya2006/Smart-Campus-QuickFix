import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

type Role = 'CAMPUS_USER' | 'AUTHORITY';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  identityVerificationStatus: string;
  phoneNumber?: string;
  collegeName?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUser = await SecureStore.getItemAsync('userData');

        if (storedToken && storedUser) {
          setState({ token: storedToken, user: JSON.parse(storedUser), isLoading: false });
        } else {
          setState({ token: null, user: null, isLoading: false });
        }
      } catch (e) {
        console.error('Failed to restore session', e);
        setState({ token: null, user: null, isLoading: false });
      }
    };

    restoreSession();
  }, []);

  const login = async (token: string, user: User) => {
    try {
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      setState({ token, user, isLoading: false });
    } catch (e) {
      console.error('Failed to save session', e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      setState({ token: null, user: null, isLoading: false });
    } catch (e) {
      console.error('Failed to delete session', e);
    }
  };

  const refreshProfile = async () => {
    if (!state.token) return;
    try {
      // Assuming apiClient is correctly configured to send Bearer token
      const API_URL = process.env.EXPO_PUBLIC_API_URL as string;
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      });
      const data = await response.json();
      if (data.success && data.user) {
        await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
        setState(prev => ({ ...prev, user: data.user }));
      }
    } catch (error) {
      console.error('Failed to refresh profile', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
