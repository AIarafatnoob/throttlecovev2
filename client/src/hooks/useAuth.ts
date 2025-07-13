import { create } from 'zustand';
import { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuth = create<AuthState>((set) => {
  // Load user from localStorage on init
  const savedUser = localStorage.getItem("user");
  const parsedUser = savedUser ? JSON.parse(savedUser) : null;

  return {
    user: parsedUser,
    setUser: (user) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
      set({ user });
    },
    clearUser: () => {
      localStorage.removeItem("user");
      set({ user: null });
    },
  };
});
