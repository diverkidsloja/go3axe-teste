
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Admin, Partner } from '../types';

interface AuthContextType {
  user: User | Admin | Partner | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock admin user (Gustavo)
const ADMIN_USER: Admin = {
  id: '1',
  name: 'Gustavo Henrique',
  email: 'admin@go3axepay.com',
  role: 'admin',
  walletId: 'wallet_asaas_gustavo123',
};

// Mock partners
const MOCK_PARTNERS: Partner[] = [
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@parceiro.com',
    role: 'partner',
    companyName: 'Empresa do João',
    responsibleName: 'João Silva',
    document: '123.456.789-00',
    phone: '(71) 99999-9999',
    apiKey: 'api_key_joao123',
    walletId: 'wallet_asaas_joao123',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | Admin | Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const storedUser = localStorage.getItem('go3axepay_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if admin
      if (email === ADMIN_USER.email && password === 'admin123') {
        setUser(ADMIN_USER);
        localStorage.setItem('go3axepay_user', JSON.stringify(ADMIN_USER));
        return;
      }
      
      // Check if partner
      const partner = MOCK_PARTNERS.find(p => p.email === email);
      if (partner && password === 'partner123') {
        setUser(partner);
        localStorage.setItem('go3axepay_user', JSON.stringify(partner));
        return;
      }
      
      throw new Error('Invalid email or password');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('go3axepay_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
