// src/pages/ResourceList.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Table, Input, Button } from '@mantine/core';

// Function to fetch SpaceX resources
const fetchResources = async () => {
  const { data } = await axios.get('https://api.spacexdata.com/v4/launches');
  return data;
};

const ResourceList: React.FC = () => {
  const { data, isLoading, error } = useQuery(['spacexLaunches'], fetchResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // Sort by name by default

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading resources.</p>;

  // Filter and sort the data
  const filteredData = data
    .filter((launch: any) =>
      launch.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        return new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime();
      }
      return 0;
    });

  return (
    <div>
      <h2>SpaceX Launches</h2>
      
      {/* Search Input */}
      <Input
        placeholder="Search launches"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb="sm"
      />

      {/* Sorting Buttons */}
      <Button onClick={() => setSortBy('name')}>Sort by Name</Button>
      <Button onClick={() => setSortBy('date')} ml="sm">Sort by Date</Button>

      {/* Display the data in a table */}
      <Table>
        <thead>
          <tr>
            <th>Launch Name</th>
            <th>Date</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((launch: any) => (
            <tr key={launch.id}>
              <td>{launch.name}</td>
              <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
              <td>{launch.details || 'No details available'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ResourceList;
