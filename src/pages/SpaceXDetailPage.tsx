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

// Fetch rocket details based on the rocket ID
const fetchRocketById = async (rocketId: string) => {
  const { data } = await axios.get(`https://api.spacexdata.com/v4/rockets/${rocketId}`);
  return data;
};

const SpaceXDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p>Launch ID is missing!</p>;
  }

  const { data: launchData, isLoading: isLoadingLaunch, error: errorLaunch } = useQuery(['launchDetail', id], () => fetchLaunchById(id));

  const { data: rocketData, isLoading: isLoadingRocket, error: errorRocket } = useQuery(['rocketDetail', launchData?.rocket], () => fetchRocketById(launchData?.rocket), {
    enabled: !!launchData?.rocket, // Only fetch rocket details if launch data is available
  });

  if (isLoadingLaunch) return <p>Loading launch details...</p>;
  if (errorLaunch) return <p>Error loading launch details.</p>;

  return (
    <div>
      <h2>Launch Details for {launchData.name}</h2>
      <p><strong>Date:</strong> {new Date(launchData.date_utc).toLocaleDateString()}</p>
      <p><strong>Rocket:</strong> {rocketData ? rocketData.name : 'Loading rocket details...'}</p>
      <p><strong>Details:</strong> {launchData.details || 'No details available'}</p>
      <p><strong>Flight Number:</strong> {launchData.flight_number}</p>
      <p><strong>Success:</strong> {launchData.success ? 'Yes' : 'No'}</p>

      {isLoadingRocket && <p>Loading rocket details...</p>}
      {errorRocket && <p>Error loading rocket details.</p>}
      {rocketData && (
        <div>
          <h3>Rocket Details</h3>
          <p><strong>Rocket Name:</strong> {rocketData.name}</p>
          <p><strong>Type:</strong> {rocketData.type}</p>
          <p><strong>Stages:</strong> {rocketData.stages}</p>
          <p><strong>Cost per Launch:</strong> ${rocketData.cost_per_launch}</p>
        </div>
      )}
    </div>
  );
};

export default SpaceXDetailPage;
