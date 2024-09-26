// src/store/app.store.ts

import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true', // Persist auth state in localStorage
  login: () => {
    localStorage.setItem('isAuthenticated', 'true'); // Store in localStorage on login
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('isAuthenticated'); // Clear localStorage on logout
    set({ isAuthenticated: false });
  },
}));
