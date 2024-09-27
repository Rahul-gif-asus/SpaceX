import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Function to fetch launches (centralized in the store)
const fetchLaunches = async () => {
  const { data } = await axios.get('https://api.spacexdata.com/v4/launches');
  return data;
};

interface LaunchState {
  launches: any[];
  page: number;
  searchTerm: string;
  sortCriteria: 'asc' | 'desc';
  filterSuccess: 'all' | 'successful' | 'failed';
  setLaunches: (launches: any[]) => void;
  setPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setSortCriteria: (criteria: 'asc' | 'desc') => void;
  setFilterSuccess: (status: 'all' | 'successful' | 'failed') => void;
}

// Zustand store
export const useLaunchStore = create<LaunchState>((set) => ({
  launches: [],
  page: 1,
  searchTerm: '',
  sortCriteria: 'asc',
  filterSuccess: 'all',
  setLaunches: (launches) => set({ launches }),
  setPage: (page) => set({ page }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortCriteria: (criteria) => set({ sortCriteria: criteria }),
  setFilterSuccess: (status) => set({ filterSuccess: status }),
}));

// useQuery to fetch launches and set them in the Zustand store
export const useFetchLaunches = () => {
  const setLaunches = useLaunchStore((state) => state.setLaunches);

  // Pass the query key as an array
  return useQuery(['spacexLaunches'], fetchLaunches, {
    onSuccess: (data) => {
      setLaunches(data);
    },
    onError: () => {
      // Handle error case if needed
    },
  });
};
