import { useState, useEffect } from 'react';
import { User } from '@/entities/user';

// Mock user data for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'owner@example.com',
    name: 'John Owner',
    role: 'owner',
    createdAt: '2024-01-01T00:00:00Z',
    lastActiveAt: '2024-01-15T10:30:00Z',
    status: 'active',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Jane Admin',
    role: 'admin',
    createdAt: '2024-01-02T00:00:00Z',
    lastActiveAt: '2024-01-15T09:15:00Z',
    status: 'active',
  },
  {
    id: '3',
    email: 'reviewer@example.com',
    name: 'Bob Reviewer',
    role: 'reviewer',
    createdAt: '2024-01-03T00:00:00Z',
    lastActiveAt: '2024-01-15T08:45:00Z',
    status: 'active',
  },
  {
    id: '4',
    email: 'annotator@example.com',
    name: 'Alice Annotator',
    role: 'annotator',
    createdAt: '2024-01-04T00:00:00Z',
    lastActiveAt: '2024-01-15T07:20:00Z',
    status: 'active',
  },
];

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // In a real app, you'd validate the token/session here
          setUser(parsedUser);
        } else {
          // Auto-login admin user for development/demo purposes
          const adminUser = MOCK_USERS.find(u => u.role === 'admin');
          if (adminUser) {
            setUser(adminUser);
            localStorage.setItem('user', JSON.stringify(adminUser));
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Mock login - in real app, this would call an API
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (foundUser && password === 'password') { // Simple mock validation
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Mock registration - in real app, this would call an API
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'annotator', // Default role for new users
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      // In real app, user would be created on server and returned
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };
};