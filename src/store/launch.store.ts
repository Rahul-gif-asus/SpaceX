// src/store/launch.store.ts
import { create } from 'zustand';

interface LaunchStoreState {
  launches: any[];
  searchTerm: string;
  page: number;
  sortCriteria: 'asc' | 'desc';
  filterSuccess: 'all' | 'successful' | 'failed';
  setLaunches: (launches: any[]) => void;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  setSortCriteria: (criteria: 'asc' | 'desc') => void;
  setFilterSuccess: (filter: 'all' | 'successful' | 'failed') => void;
}

export const useLaunchStore = create<LaunchStoreState>((set) => ({
  launches: [],
  searchTerm: '',
  page: 1,
  sortCriteria: 'asc',
  filterSuccess: 'all',
  setLaunches: (launches) => set({ launches }),
  setSearchTerm: (term) => set({ searchTerm: term, page: 1 }), // Reset page when search changes
  setPage: (page) => set({ page }),
  setSortCriteria: (criteria) => set({ sortCriteria: criteria, page: 1 }), // Reset page when sorting changes
  setFilterSuccess: (filter) => set({ filterSuccess: filter, page: 1 }), // Reset page when filter changes
}));
