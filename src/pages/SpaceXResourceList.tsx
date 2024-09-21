// src/pages/SpaceXResourceList.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Table } from '@mantine/core';
import { Link } from 'react-router-dom';

const fetchLaunches = async () => {
  const { data } = await axios.get('https://api.spacexdata.com/v4/launches');
  return data;
};

const SpaceXResourceList: React.FC = () => {
  const { data, isLoading, error } = useQuery(['spacexLaunches'], fetchLaunches);
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading SpaceX data.</p>;

  const filteredData = data.filter((launch: any) =>
    launch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>SpaceX Launches</h2>
      <input
        type="text"
        placeholder="Search launches"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
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
              <td>
                <Link to={`/spacex/launches/${launch.id}`}>
                  {launch.name}
                </Link>
              </td>
              <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
              <td>{launch.details || 'No details available'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SpaceXResourceList;
