import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Table, Input, Select, Loader } from '@mantine/core';

// Fetch SpaceX launches data from the SpaceX API
const fetchLaunches = async () => {
  const { data } = await axios.get('https://api.spacexdata.com/v4/launches');
  return data;
};

const SpaceXResourceList: React.FC = () => {
  const { data, isLoading, error } = useQuery(['spacexLaunches'], fetchLaunches);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState<'asc' | 'desc'>('asc');
  const [filterSuccess, setFilterSuccess] = useState<'all' | 'successful' | 'failed'>('all');

  if (isLoading) return <Loader />;
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

  return (
    <div>
      <h2>SpaceX Launches</h2>

      {/* Search Input */}
      <Input
        placeholder="Search launches"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />

      {/* Sort Selector */}
      <Select
        label="Sort by Date"
        placeholder="Pick one"
        value={sortCriteria}
        onChange={(value: 'asc' | 'desc' | null) => {
          if (value) setSortCriteria(value); // Ensure value is not null
        }}
        data={[
          { value: 'asc', label: 'Ascending' },
          { value: 'desc', label: 'Descending' },
        ]}
      />

      {/* Filter for Success/Failure */}
      <Select
        label="Filter by Launch Status"
        placeholder="Pick one"
        value={filterSuccess}
        onChange={(value: 'all' | 'successful' | 'failed' | null) => {
          if (value) setFilterSuccess(value); // Ensure value is not null
        }}
        data={[
          { value: 'all', label: 'All' },
          { value: 'successful', label: 'Successful' },
          { value: 'failed', label: 'Failed' },
        ]}
      />

      {/* Table to display data */}
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Details</th>
            <th>Success</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((launch: any) => (
            <tr key={launch.id}>
              <td>{launch.name}</td>
              <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
              <td>{launch.details || 'No details available'}</td>
              <td>{launch.success ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SpaceXResourceList;
