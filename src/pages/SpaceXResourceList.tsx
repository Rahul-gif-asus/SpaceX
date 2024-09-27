import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Table, Input, Select, Loader, Pagination, Text } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications'; 
import LogoutButton from '../components/Logout';
import { useNavigate } from 'react-router-dom'; 
import { useLaunchStore } from '../store/launch.store'; // Import Zustand store

// Fetch SpaceX launches from API
const fetchLaunches = async () => {
  const { data } = await axios.get('https://api.spacexdata.com/v4/launches');
  return data;
};

const SpaceXResourceList: React.FC = () => {
  const navigate = useNavigate(); 

  // Zustand store state and actions
  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    sortCriteria,
    setSortCriteria,
    filterSuccess,
    setFilterSuccess,
    setLaunches,
  } = useLaunchStore((state) => ({
    page: state.page,
    setPage: state.setPage,
    searchTerm: state.searchTerm,
    setSearchTerm: state.setSearchTerm,
    sortCriteria: state.sortCriteria,
    setSortCriteria: state.setSortCriteria,
    filterSuccess: state.filterSuccess,
    setFilterSuccess: state.setFilterSuccess,
    setLaunches: state.setLaunches,
  }));

  const pageSize = 10; // Number of launches per page
  const [loadingMessage, setLoadingMessage] = React.useState('Fetching SpaceX Launches...');

  const { data, isLoading, error } = useQuery(['spacexLaunches'], fetchLaunches);

  // Set launches in Zustand store when data is fetched
  useEffect(() => {
    if (data) {
      setLaunches(data); // Set launches in the Zustand store
    }
  }, [data, setLaunches]);

  // Show loading notification when data is loading
  useEffect(() => {
    if (isLoading) {
      showNotification({
        id: 'loading-data', 
        title: 'Loading Data',
        message: 'Fetching SpaceX launches...',
        color: 'blue',
        autoClose: false,
        withCloseButton: false,
      });

      const timeout = setTimeout(() => {
        setLoadingMessage('Thanks for your patience...');
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Update notification when data is successfully loaded
  useEffect(() => {
    if (data) {
      updateNotification({
        id: 'loading-data',
        title: 'Launches Loaded',
        message: 'Successfully loaded SpaceX launches data.',
        color: 'green',
        autoClose: 2500,
        withCloseButton: false,
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Loader size="lg" variant="dots" />
        <Text mt="md">{loadingMessage}</Text>
      </div>
    );
  }

  if (error) {
    showNotification({
      title: 'Error Loading Data',
      message: 'There was an error loading SpaceX launches. Please try again later.',
      color: 'red',
    });
    return <Text color="red">Error loading SpaceX launches.</Text>;
  }

  // Filter and Search functionality
  const filteredData = data.filter((launch: any) => {
    const matchesSearch = launch.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterSuccess === 'successful' && !launch.success) return false;
    if (filterSuccess === 'failed' && launch.success) return false;

    return matchesSearch;
  });

  // Sort functionality by date
  const sortedData = filteredData.sort((a: any, b: any) =>
    sortCriteria === 'asc'
      ? new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime()
      : new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime()
  );

  // Pagination
  const totalFiltered = sortedData.length;
  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  // Handle row click to navigate to SpaceXDetailPage
  const handleRowClick = (launchId: string) => {
    navigate(`/private/spacexdetailpage/${launchId}`); 
  };

  return (
    <div style={{ padding: '2rem' }}>
      <LogoutButton />

      <h1 style={{ marginBottom: '1.5rem', color: 'black', fontFamily: 'SpaceX, sans-serif' }}>
        Search SpaceX Launches
      </h1>

      <div style={{ marginBottom: '2rem' }}>
        {/* Search Input */}
        <Input
          placeholder="Search launches"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.currentTarget.value);
            setPage(1);
          }}
          style={{ marginBottom: '1rem' }}
        />

        {/* Sort Selector */}
        <Select
          label="Sort by Date"
          placeholder="Pick one"
          value={sortCriteria}
          onChange={(value: 'asc' | 'desc' | null) => {
            if (value) {
              setSortCriteria(value);
              setPage(1);
            }
          }}
          data={[
            { value: 'asc', label: 'Ascending' },
            { value: 'desc', label: 'Descending' },
          ]}
          style={{ marginBottom: '1rem' }}
        />

        {/* Filter for Success/Failure */}
        <Select
          label="Filter by Launch Status"
          placeholder="Pick one"
          value={filterSuccess}
          onChange={(value: 'all' | 'successful' | 'failed' | null) => {
            if (value) {
              setFilterSuccess(value);
              setPage(1);
            }
          }}
          data={[
            { value: 'all', label: 'All' },
            { value: 'successful', label: 'Successful' },
            { value: 'failed', label: 'Failed' },
          ]}
        />
      </div>

      {/* Table to display data */}
      <Table style={{ marginTop: '2rem', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Details</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Success</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((launch: any) => (
            <tr
              key={launch.id}
              onClick={() => handleRowClick(launch.id)} 
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                borderBottom: '1px solid #ddd',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <td style={{ padding: '10px' }}>{launch.name}</td>
              <td style={{ padding: '10px' }}>{new Date(launch.date_utc).toLocaleDateString()}</td>
              <td style={{ padding: '10px' }}>{launch.details || 'No details available'}</td>
              <td style={{ padding: '10px' }}>{launch.success ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Component */}
      <Pagination
        value={page}
        onChange={setPage}
        total={Math.ceil(totalFiltered / pageSize)}
        style={{ marginTop: '1rem' }}
      />
    </div>
  );
};

export default SpaceXResourceList;
