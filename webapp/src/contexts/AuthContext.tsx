import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { trpc } from '../utils/trpc';
import type { User, AuthResponse } from '../lib/api-types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const utils = trpc.useUtils();
  const { data: currentUser, error } = trpc.auth.me.useQuery(undefined, {
    enabled: !!localStorage.getItem('token'),
  }) as { data?: User; error?: any };

  useEffect(() => {
    if (error) {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [error]);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || null,
        role: data.user.role as 'USER' | 'ADMIN',
      });
      utils.auth.me.invalidate();
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || null,
        role: data.user.role as 'USER' | 'ADMIN',
      });
      utils.auth.me.invalidate();
    },
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      localStorage.removeItem('token');
      setUser(null);
      utils.invalidate();
    },
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name || null,
        role: currentUser.role as 'USER' | 'ADMIN',
      });
    }
    setLoading(false);
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string, name?: string) => {
    await registerMutation.mutateAsync({ email, password, name });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}