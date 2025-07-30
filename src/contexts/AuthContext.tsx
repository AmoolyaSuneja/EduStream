import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('edustream_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const existingUsers = JSON.parse(localStorage.getItem('edustream_users') || '[]');
      const existingUser = existingUsers.find((u: User) => u.email === email);
      
      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('edustream_user', JSON.stringify(existingUser));
        setIsLoading(false);
        return true;
      } else {
        // Create new user for login
        const newUser: User = {
          id: Date.now().toString(),
          name: email.split('@')[0], // Use email prefix as name
          email: email,
          avatar: email.charAt(0).toUpperCase()
        };
        
        setUser(newUser);
        localStorage.setItem('edustream_user', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (name && email && password) {
      const existingUsers = JSON.parse(localStorage.getItem('edustream_users') || '[]');
      const existingUser = existingUsers.find((u: User) => u.email === email);
      
      if (existingUser) {
        setIsLoading(false);
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
        avatar: name.charAt(0).toUpperCase()
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('edustream_users', JSON.stringify(existingUsers));
      
      setUser(newUser);
      localStorage.setItem('edustream_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edustream_user');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('edustream_user', JSON.stringify(updatedUser));
    
    const existingUsers = JSON.parse(localStorage.getItem('edustream_users') || '[]');
    const userIndex = existingUsers.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      existingUsers[userIndex] = updatedUser;
      localStorage.setItem('edustream_users', JSON.stringify(existingUsers));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};