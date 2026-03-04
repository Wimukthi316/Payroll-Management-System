// eslint-disable-next-line react-refresh/only-export-components
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
    // Derive a display name: use provided name, or readable prefix from email
    const derivedName =
      credentials.name ??
      (credentials.email
        ? credentials.email.split('@')[0].replace(/[._-]/g, ' ')
        : 'User');
    const mockUser = {
      id: '1',
      name: derivedName,
      email: credentials.email,
      role: 'Admin',
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
