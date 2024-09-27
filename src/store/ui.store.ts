import { create } from 'zustand';

interface UIState {
  hasClickedGetStarted: boolean;
  hasClickedLearnMore: boolean;
  clickGetStarted: () => void;
  clickLearnMore: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  hasClickedGetStarted: false,
  hasClickedLearnMore: false,
  clickGetStarted: () => set({ hasClickedGetStarted: true }),
  clickLearnMore: () => set({ hasClickedLearnMore: true }),
}));
