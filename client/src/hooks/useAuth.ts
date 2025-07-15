import { create } from 'zustand';
import { User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  
  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      isLoading: false 
    });
  },
  
  clearUser: () => {
    set({ 
      user: null, 
      isAuthenticated: false,
      isLoading: false 
    });
  },
  
  checkSession: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        set({ 
          user: userData, 
          isAuthenticated: true,
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Session check failed:', error);
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    }
  },
  
  logout: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server logout fails
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    }
  }
}));

// Initialize session check when the module loads
useAuth.getState().checkSession();