import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('payrollpro_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const signIn = useCallback((credentials) => {
    // Mock auth — swap for real API call when backend auth is added
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email: credentials.email,
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2',
    };
    localStorage.setItem('payrollpro_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('payrollpro_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
