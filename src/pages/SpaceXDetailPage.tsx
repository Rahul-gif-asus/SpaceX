import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Container, Text, Loader, Paper, Title, Group, Badge, Button, Card,
  Divider, Grid, Image, Modal
} from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications'; // Import updateNotification
import LogoutButton from '../components/Logout';

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
  const [loadingMessage, setLoadingMessage] = useState('Fetching SpaceX Launch details...');
  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!id) {
    return <Text color="red">Launch ID is missing!</Text>;
  }

  // Launch Data Query
  const { data: launchData, isLoading: isLoadingLaunch, error: errorLaunch } = useQuery(['launchDetail', id], () => fetchLaunchById(id));

  // Rocket Data Query
  const { data: rocketData, isLoading: isLoadingRocket, error: errorRocket } = useQuery(
    ['rocketDetail', launchData?.rocket],
    () => fetchRocketById(launchData?.rocket),
    { enabled: !!launchData?.rocket }
  );

  // Notifications for loading launch data
  useEffect(() => {
    if (isLoadingLaunch) {
      showNotification({
        id: 'loading-launch-data',
        title: 'Loading Launch Data',
        message: 'Fetching SpaceX launch details...',
        color: 'blue',
        autoClose: false, // Keep notification open until manually closed or updated
        withCloseButton: false,
      });

      const timeout = setTimeout(() => {
        setLoadingMessage('Thanks for your patience...');
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isLoadingLaunch]);

  // Notifications for successful launch data load
  useEffect(() => {
    if (launchData) {
      updateNotification({
        id: 'loading-launch-data',
        title: 'Launch Data Loaded',
        message: `Successfully loaded SpaceX launch data for ${launchData.name}.`,
        color: 'green',
        autoClose: 3000, // Automatically close after 3 seconds
        withCloseButton: false,
      });
    }
  }, [launchData]);

  // Handling errors
  if (errorLaunch) {
    showNotification({
      title: 'Error Loading Launch Data',
      message: 'There was an error loading SpaceX launch data. Please try again later.',
      color: 'red',
      withCloseButton: false,
      autoClose: 3000,
    });
    return <Text color="red">Error loading launch details.</Text>;
  }

  // Image preview functionality
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpened(true);
  };

  // Loading Screen
  if (isLoadingLaunch) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Loader size="lg" variant="dots" />
        <Text mt="md">{loadingMessage}</Text>
      </div>
    );
  }

  return (
    <Container size="lg">
      <LogoutButton />
      <Card shadow="lg" padding="lg" radius="md" withBorder style={{ backgroundColor: '#f9f9f9', borderRadius: '16px' }}>
        <Title order={2} mb="lg" align="center" style={{ fontWeight: 700, fontSize: '1.5rem', color: '#2C3E50' }}>
          Launch Details for {launchData.name}
        </Title>
        <Group spacing="xl" position="center">
          <Text><strong>Date:</strong> {new Date(launchData.date_utc).toLocaleDateString()}</Text>
          <Text><strong>Flight Number:</strong> {launchData.flight_number}</Text>
          <Text><strong>Success:</strong> {launchData.success ? <Badge color="green" variant="filled">Yes</Badge> : <Badge color="red" variant="filled">No</Badge>}</Text>
        </Group>

        <Divider my="md" />

        <Text mt="sm" align="center" color="dimmed"><strong>Details:</strong> {launchData.details || 'No details available'}</Text>

        {/* Fairing Details */}
        {launchData.fairings && (
          <Paper shadow="xs" p="md" radius="lg" mt="lg" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
            <Title order={4} align="center" style={{ color: '#2980B9' }}>Fairing Details</Title>
            <Group spacing="xl" position="center" mt="md">
              <Text><strong>Reused:</strong> {launchData.fairings.reused ? 'Yes' : 'No'}</Text>
              <Text><strong>Recovery Attempt:</strong> {launchData.fairings.recovery_attempt ? 'Yes' : 'No'}</Text>
              <Text><strong>Recovered:</strong> {launchData.fairings.recovered ? 'Yes' : 'No'}</Text>
            </Group>
          </Paper>
        )}

        {/* Links */}
        <Title order={4} mt="lg" align="center" style={{ color: '#2980B9' }}>Useful Links</Title>
        <Group position="center" mt="md">
          <Button component="a" href={launchData.links.webcast} target="_blank" rel="noopener noreferrer" variant="light" color="blue">
            Webcast
          </Button>
          <Button component="a" href={launchData.links.article} target="_blank" rel="noopener noreferrer" variant="light" color="blue">
            Article
          </Button>
          <Button component="a" href={launchData.links.wikipedia} target="_blank" rel="noopener noreferrer" variant="light" color="blue">
            Wikipedia
          </Button>
        </Group>

        {/* Core Details */}
        {launchData.cores && launchData.cores.length > 0 && (
          <Paper shadow="xs" p="md" radius="lg" mt="lg" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
            <Title order={4} align="center" style={{ color: '#2980B9' }}>Core Details</Title>
            {launchData.cores.map((core: any, index: number) => (
              <Group spacing="md" position="center" mt="md" key={index}>
                <Text><strong>Flight:</strong> {core.flight}</Text>
                <Text><strong>Grid Fins:</strong> {core.gridfins ? 'Yes' : 'No'}</Text>
                <Text><strong>Legs:</strong> {core.legs ? 'Yes' : 'No'}</Text>
                <Text><strong>Reused:</strong> {core.reused ? 'Yes' : 'No'}</Text>
                <Text><strong>Landing Attempt:</strong> {core.landing_attempt ? 'Yes' : 'No'}</Text>
                <Text><strong>Landing Success:</strong> {core.landing_success === null ? 'N/A' : core.landing_success ? 'Yes' : 'No'}</Text>
              </Group>
            ))}
          </Paper>
        )}

        {isLoadingRocket && <Loader mt="lg" />}
        {errorRocket && <Text color="red" align="center">Error loading rocket details.</Text>}

        {rocketData && (
          <Paper shadow="md" p="md" radius="lg" mt="lg" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
            <Title order={3} align="center" style={{ color: '#2C3E50', fontWeight: 700 }}>Rocket Details: {rocketData.name}</Title>
            <Group spacing="xl" position="center" mt="md">
              <Text><strong>Height:</strong> {rocketData.height.meters} meters</Text>
              <Text><strong>Diameter:</strong> {rocketData.diameter.meters} meters</Text>
              <Text><strong>Mass:</strong> {rocketData.mass.kg} kg</Text>
              <Text><strong>First Flight:</strong> {rocketData.first_flight}</Text>
              <Text><strong>Country:</strong> {rocketData.country}</Text>
            </Group>
            <Text mt="sm" align="center" color="dimmed"><strong>Description:</strong> {rocketData.description}</Text>

            {/* Rocket First Stage */}
            <Title order={4} mt="lg" align="center" style={{ color: '#2980B9' }}>First Stage</Title>
            <Group spacing="xl" position="center" mt="md">
              <Text><strong>Thrust (Sea Level):</strong> {rocketData.first_stage.thrust_sea_level.kN} kN</Text>
              <Text><strong>Thrust (Vacuum):</strong> {rocketData.first_stage.thrust_vacuum.kN} kN</Text>
              <Text><strong>Reusable:</strong> {rocketData.first_stage.reusable ? 'Yes' : 'No'}</Text>
            </Group>

            {/* Rocket Second Stage */}
            <Title order={4} mt="lg" align="center" style={{ color: '#2980B9' }}>Second Stage</Title>
            <Group spacing="xl" position="center" mt="md">
              <Text><strong>Thrust:</strong> {rocketData.second_stage.thrust.kN}</Text>
              <Text><strong>Fuel Amount:</strong> {rocketData.second_stage.fuel_amount_tons} tons</Text>
              <Text><strong>Burn Time:</strong> {rocketData.second_stage.burn_time_sec} seconds</Text>
            </Group>

            {/* Payload Weights */}
            {rocketData.payload_weights && rocketData.payload_weights.length > 0 && (
              <Paper shadow="xs" p="md" radius="lg" mt="lg" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
                <Title order={4} align="center" style={{ color: '#2980B9' }}>Payload Weights</Title>
                {rocketData.payload_weights.map((payload: any, index: number) => (
                  <Group key={index} spacing="xl" position="center">
                    <Text><strong>{payload.name}:</strong> {payload.kg} kg ({payload.lb} lb)</Text>
                  </Group>
                ))}
              </Paper>
            )}

            {/* Flickr Images with Preview */}
            <Title order={4} mt="lg" align="center" style={{ color: '#2980B9' }}>Flickr Images</Title>
            <Grid mt="md">
              {rocketData.flickr_images.map((image: string, index: number) => (
                <Grid.Col span={4} key={index}>
                  <Image
                    src={image}
                    alt={`Rocket Image ${index}`}
                    radius="lg"
                    sx={{
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => handleImageClick(image)} // Open image in Modal on click
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Paper>
        )}
      </Card>

      {/* Modal for Image Preview */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="xl"
        title="Rocket Image Preview"
      >
        <Image src={selectedImage!} radius="md" />
      </Modal>
    </Container>
  );
};

export default SpaceXDetailPage;
