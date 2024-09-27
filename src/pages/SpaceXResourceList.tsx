import React, { useEffect } from 'react';
import { Table, Input, Select, Loader, Pagination, Text, Button } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import LogoutButton from '../components/Logout';
import { useNavigate } from 'react-router-dom';
import { useLaunchStore, useFetchLaunches } from '../store/launch.store';

const SpaceXResourceList: React.FC = () => {
  const navigate = useNavigate();

  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    sortCriteria,
    setSortCriteria,
    filterSuccess,
    setFilterSuccess,
    launches,
  } = useLaunchStore((state) => ({
    page: state.page,
    setPage: state.setPage,
    searchTerm: state.searchTerm,
    setSearchTerm: state.setSearchTerm,
    sortCriteria: state.sortCriteria,
    setSortCriteria: state.setSortCriteria,
    filterSuccess: state.filterSuccess,
    setFilterSuccess: state.setFilterSuccess,
    launches: state.launches,
  }));

  const pageSize = 10;
  const [loadingMessage, setLoadingMessage] = React.useState('Fetching SpaceX Launches...');
  const { isLoading, error } = useFetchLaunches();

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortCriteria('asc');
    setFilterSuccess('all');
    setPage(1);
  };

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

  useEffect(() => {
    if (launches && !isLoading) {
      updateNotification({
        id: 'loading-data',
        title: 'Launches Loaded',
        message: 'Successfully loaded SpaceX launches data.',
        color: 'green',
        autoClose: 2500,
        withCloseButton: false,
      });
    }
  }, [launches, isLoading]);

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

  const filteredData = launches.filter((launch: any) => {
    const matchesSearch = launch.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterSuccess === 'successful' && !launch.success) return false;
    if (filterSuccess === 'failed' && launch.success) return false;

    return matchesSearch;
  });

  const sortedData = filteredData.sort((a: any, b: any) =>
    sortCriteria === 'asc'
      ? new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime()
      : new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime()
  );

  const totalFiltered = sortedData.length;
  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  const handleRowClick = (launchId: string) => {
    navigate(`/private/spacexdetailpage/${launchId}`);
  };

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      {/* Logout Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <LogoutButton />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: 'black', fontFamily: 'SpaceX, sans-serif' }}>
          Search SpaceX Launches
        </h1>


      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button
          variant="outline"
          color="gray"
          onClick={handleClearFilters}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '14px',
          }}
        >
          Clear Filters
        </Button>
      </div>


      <div style={{ marginBottom: '2rem' }}>
        <Input
          placeholder="Search launches"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.currentTarget.value);
            setPage(1);
          }}
          style={{ marginBottom: '1rem' }}
        />

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

      {filteredData.length === 0 && (
        <Text color="dimmed" size="lg" weight={500} style={{ textAlign: 'center', marginTop: '1rem' }}>
          No SpaceX launches found matching the applied filters.
        </Text>
      )}

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
