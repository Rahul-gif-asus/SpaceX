// src/store/app.store.ts
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  logoutInitiated: boolean; // Add the logoutInitiated state
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true', // Persist auth state in localStorage
  logoutInitiated: false, // Initial state of logoutInitiated

  login: () => {
    localStorage.setItem('isAuthenticated', 'true'); // Store in localStorage on login
    set({ isAuthenticated: true, logoutInitiated: false }); // Reset logoutInitiated on login
  },

  logout: () => {
    localStorage.removeItem('isAuthenticated'); // Clear localStorage on logout
    set({ isAuthenticated: false, logoutInitiated: true }); // Set logoutInitiated to true
  },
}));
