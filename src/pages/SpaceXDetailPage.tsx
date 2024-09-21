// src/pages/SpaceXDetailPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch launch details based on the launch ID
const fetchLaunchById = async (id: string) => {
  const { data } = await axios.get(`https://api.spacexdata.com/v4/launches/${id}`);
  return data;
};

const SpaceXDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve the launch ID from the URL

  // Handle the case where id is undefined
  if (!id) {
    return <p>Launch ID is missing!</p>;
  }

  const { data, isLoading, error } = useQuery(['launchDetail', id], () => fetchLaunchById(id));

  if (isLoading) return <p>Loading launch details...</p>;
  if (error) return <p>Error loading launch details.</p>;

  return (
    <div>
      <h2>Launch Details for {data.name}</h2>
      <p><strong>Date:</strong> {new Date(data.date_utc).toLocaleDateString()}</p>
      <p><strong>Rocket:</strong> {data.rocket}</p>
      <p><strong>Details:</strong> {data.details || 'No details available'}</p>
      <p><strong>Flight Number:</strong> {data.flight_number}</p>
      <p><strong>Success:</strong> {data.success ? 'Yes' : 'No'}</p>
      {/* You can add more details if necessary */}
    </div>
  );
};

export default SpaceXDetailPage;
