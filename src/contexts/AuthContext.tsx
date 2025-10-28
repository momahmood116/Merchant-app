import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

interface AuthContextType {
  user: any | null;
  accessToken: string | null;
  signIn: (phoneNumber: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.getCurrentUser(token)
        .then(({ user }) => {
          setUser(user);
          setAccessToken(token);
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (phoneNumber: string, password: string) => {
    const { accessToken: token, userId } = await api.signIn(phoneNumber, password);
    const { user } = await api.getCurrentUser(token);
    
    setUser(user);
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
  };

  const signOut = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
