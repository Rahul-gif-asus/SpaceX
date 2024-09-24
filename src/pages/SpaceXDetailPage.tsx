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

  const { data: rocketData, isLoading: isLoadingRocket, error: errorRocket } = useQuery(
    ['rocketDetail', launchData?.rocket],
    () => fetchRocketById(launchData?.rocket),
    { enabled: !!launchData?.rocket }
  );

  if (isLoadingLaunch) return <p>Loading launch details...</p>;
  if (errorLaunch) return <p>Error loading launch details.</p>;

  return (
    <div>
      <h2>Launch Details for {launchData.name}</h2>
      <p><strong>Date:</strong> {new Date(launchData.date_utc).toLocaleDateString()}</p>
      <p><strong>Flight Number:</strong> {launchData.flight_number}</p>
      <p><strong>Success:</strong> {launchData.success ? 'Yes' : 'No'}</p>
      <p><strong>Details:</strong> {launchData.details || 'No details available'}</p>

      {/* Fairing Details */}
      {launchData.fairings && (
        <>
          <h4>Fairing Details</h4>
          <p><strong>Reused:</strong> {launchData.fairings.reused ? 'Yes' : 'No'}</p>
          <p><strong>Recovery Attempt:</strong> {launchData.fairings.recovery_attempt ? 'Yes' : 'No'}</p>
          <p><strong>Recovered:</strong> {launchData.fairings.recovered ? 'Yes' : 'No'}</p>
        </>
      )}

      {/* Links */}
      <h4>Links</h4>
      <p><strong>Webcast:</strong> <a href={launchData.links.webcast} target="_blank" rel="noopener noreferrer">{launchData.links.webcast}</a></p>
      <p><strong>Article:</strong> <a href={launchData.links.article} target="_blank" rel="noopener noreferrer">{launchData.links.article}</a></p>
      <p><strong>Wikipedia:</strong> <a href={launchData.links.wikipedia} target="_blank" rel="noopener noreferrer">{launchData.links.wikipedia}</a></p>

      {/* Core Details */}
      {launchData.cores && launchData.cores.length > 0 && (
        <>
          <h4>Core Details</h4>
          {launchData.cores.map((core: any, index: number) => (
            <div key={index}>
              <p><strong>Flight:</strong> {core.flight}</p>
              <p><strong>Grid Fins:</strong> {core.gridfins ? 'Yes' : 'No'}</p>
              <p><strong>Legs:</strong> {core.legs ? 'Yes' : 'No'}</p>
              <p><strong>Reused:</strong> {core.reused ? 'Yes' : 'No'}</p>
              <p><strong>Landing Attempt:</strong> {core.landing_attempt ? 'Yes' : 'No'}</p>
              <p><strong>Landing Success:</strong> {core.landing_success === null ? 'N/A' : core.landing_success ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </>
      )}

      {isLoadingRocket && <p>Loading rocket details...</p>}
      {errorRocket && <p>Error loading rocket details.</p>}

      {rocketData && (
        <>
          <h3>Rocket Details: {rocketData.name}</h3>
          <p><strong>Height:</strong> {rocketData.height.meters} meters</p>
          <p><strong>Diameter:</strong> {rocketData.diameter.meters} meters</p>
          <p><strong>Mass:</strong> {rocketData.mass.kg} kg</p>
          <p><strong>First Flight:</strong> {rocketData.first_flight}</p>
          <p><strong>Country:</strong> {rocketData.country}</p>
          <p><strong>Description:</strong> {rocketData.description}</p>

          {/* Rocket First Stage */}
          <h4>First Stage</h4>
          <p><strong>Thrust (Sea Level):</strong> {rocketData.first_stage.thrust_sea_level.kN} kN</p>
          <p><strong>Thrust (Vacuum):</strong> {rocketData.first_stage.thrust_vacuum.kN} kN</p>
          <p><strong>Reusable:</strong> {rocketData.first_stage.reusable ? 'Yes' : 'No'}</p>

          {/* Rocket Second Stage */}
          <h4>Second Stage</h4>
          <p><strong>Thrust:</strong> {rocketData.second_stage.thrust.kN} kN</p>
          <p><strong>Fuel Amount:</strong> {rocketData.second_stage.fuel_amount_tons} tons</p>
          <p><strong>Burn Time:</strong> {rocketData.second_stage.burn_time_sec} seconds</p>

          {/* Payload Weights */}
          {rocketData.payload_weights && rocketData.payload_weights.length > 0 && (
            <>
              <h4>Payload Weights</h4>
              {rocketData.payload_weights.map((payload: any, index: number) => (
                <p key={index}><strong>{payload.name}:</strong> {payload.kg} kg ({payload.lb} lb)</p>
              ))}
            </>
          )}

          {/* Flickr Images */}
          <div>
            <h4>Flickr Images:</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              {rocketData.flickr_images.map((image: string, index: number) => (
                <img key={index} src={image} alt={`Rocket Image ${index}`} width="200px" />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpaceXDetailPage;
