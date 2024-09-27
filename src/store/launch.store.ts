import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';

// Function to fetch all launches (centralized in the store)
const fetchLaunches = async () => {
  const { data } = await axios.get('https://api.spacexdata.com/v4/launches');
  return data;
};

// Function to fetch launch details by ID
const fetchLaunchById = async (id: string) => {
  const { data } = await axios.get(`https://api.spacexdata.com/v4/launches/${id}`);
  return data;
};

// Function to fetch rocket details by rocket ID
const fetchRocketById = async (rocketId: string) => {
  const { data } = await axios.get(`https://api.spacexdata.com/v4/rockets/${rocketId}`);
  return data;
};

// Zustand interface for state
interface LaunchState {
  launches: any[];
  launchDetails: any | null;
  rocketDetails: any | null;
  page: number;
  searchTerm: string;
  sortCriteria: 'asc' | 'desc';
  filterSuccess: 'all' | 'successful' | 'failed';
  setLaunches: (launches: any[]) => void;
  setLaunchDetails: (launch: any) => void;
  setRocketDetails: (rocket: any) => void;
  setPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setSortCriteria: (criteria: 'asc' | 'desc') => void;
  setFilterSuccess: (status: 'all' | 'successful' | 'failed') => void;
}

// Zustand store
export const useLaunchStore = create<LaunchState>((set) => ({
  launches: [],
  launchDetails: null,
  rocketDetails: null,
  page: 1,
  searchTerm: '',
  sortCriteria: 'asc',
  filterSuccess: 'all',
  setLaunches: (launches) => set({ launches }),
  setLaunchDetails: (launch) => set({ launchDetails: launch }),
  setRocketDetails: (rocket) => set({ rocketDetails: rocket }),
  setPage: (page) => set({ page }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortCriteria: (criteria) => set({ sortCriteria: criteria }),
  setFilterSuccess: (status) => set({ filterSuccess: status }),
}));

// Fetch all launches and store them in Zustand
export const useFetchLaunches = () => {
  const setLaunches = useLaunchStore((state) => state.setLaunches);

  return useQuery(['spacexLaunches'], fetchLaunches, {
    onSuccess: (data) => {
      setLaunches(data);
    },
    onError: (error: any) => {
      console.error('Error fetching SpaceX launches:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to load SpaceX launches. Please try again later.',
        color: 'red',
      });
    },
  });
};

// Fetch launch details by ID and store in Zustand
export const useFetchLaunchDetails = (id: string) => {
  const setLaunchDetails = useLaunchStore((state) => state.setLaunchDetails);

  return useQuery(['launchDetail', id], () => fetchLaunchById(id), {
    onSuccess: (data) => {
      setLaunchDetails(data);
    },
    onError: (error: any) => {
      console.error('Error fetching SpaceX launch details:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to load SpaceX launch details. Please try again later.',
        color: 'red',
      });
    },
  });
};

// Fetch rocket details by rocket ID and store in Zustand
export const useFetchRocketDetails = (rocketId: string) => {
  const setRocketDetails = useLaunchStore((state) => state.setRocketDetails);

  return useQuery(['rocketDetail', rocketId], () => fetchRocketById(rocketId), {
    enabled: !!rocketId, // Only fetch if rocketId is present
    onSuccess: (data) => {
      setRocketDetails(data);
    },
    onError: (error: any) => {
      console.error('Error fetching SpaceX rocket details:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to load SpaceX rocket details. Please try again later.',
        color: 'red',
      });
    },
  });
};
