// src/store/app.store.ts

import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true', // Persisted state
  login: () => {
    localStorage.setItem('isAuthenticated', 'true'); // Save to localStorage
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('isAuthenticated'); // Remove from localStorage
    set({ isAuthenticated: false });
  },
}));
