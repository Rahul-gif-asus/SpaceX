import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Table, Input, Select, Loader, Pagination } from '@mantine/core';

// Fetch SpaceX launches from API
const fetchLaunches = async () => {
  const { data } = await axios.get('https://api.spacexdata.com/v4/launches');
  return data;
};

const SpaceXResourceList: React.FC = () => {
  const pageSize = 10; // Set the number of launches per page
  const [page, setPage] = useState(1); // Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState<'asc' | 'desc'>('asc');
  const [filterSuccess, setFilterSuccess] = useState<'all' | 'successful' | 'failed'>('all');

  const { data, isLoading, error } = useQuery(['spacexLaunches'], fetchLaunches);

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loader />
    </div>
  );
  if (error) return <p>Error loading SpaceX launches.</p>;

  // Filter and Search functionality
  const filteredData = data.filter((launch: any) => {
    const matchesSearch = launch.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by success status
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

  // Apply pagination AFTER filtering and sorting
  const totalFiltered = sortedData.length;
  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ padding: '2rem' }}>
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
            setPage(1);  // Reset to first page when filter changes
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
              setPage(1);  // Reset to first page when sorting changes
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
              setPage(1);  // Reset to first page when filtering changes
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
      <Table style={{ marginTop: '2rem' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Details</th>
            <th>Success</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((launch: any) => (
            <tr key={launch.id}>
              <td>{launch.name}</td>
              <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
              <td>{launch.details || 'No details available'}</td>
              <td>{launch.success ? 'Yes' : 'No'}</td>
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
