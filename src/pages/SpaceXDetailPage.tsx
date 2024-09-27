import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate for back button
import {
  Container, Text, Loader, Paper, Title, Group, Badge, Button, Card,
  Divider, Grid, Image, Modal
} from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import LogoutButton from '../components/Logout';
import { useLaunchStore, useFetchLaunchDetails, useFetchRocketDetails } from '../store/launch.store'; // Import Zustand hooks

const SpaceXDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get launch ID from URL params
  const navigate = useNavigate(); // For back button navigation

  // Zustand store state and actions
  const {
    launchDetails,
    rocketDetails,
  } = useLaunchStore((state) => ({
    launchDetails: state.launchDetails,
    rocketDetails: state.rocketDetails,
  }));

  // Fetch launch details using Zustand
  const { isLoading: isLoadingLaunch, error: errorLaunch } = useFetchLaunchDetails(id!);

  // Fetch rocket details based on the rocket ID from launchDetails
  const { isLoading: isLoadingRocket, error: errorRocket } = useFetchRocketDetails(launchDetails?.rocket);

  const [loadingMessage, setLoadingMessage] = useState('Fetching SpaceX Launch details...');
  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Notification for loading state
  useEffect(() => {
    if (isLoadingLaunch) {
      showNotification({
        id: 'loading-launch-data',
        title: 'Loading Launch Data',
        message: 'Fetching SpaceX launch details...',
        color: 'blue',
        autoClose: false,
        withCloseButton: false,
      });

      const timeout = setTimeout(() => {
        setLoadingMessage('Thanks for your patience...');
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isLoadingLaunch]);

  // Update notification for successful data loading
  useEffect(() => {
    if (launchDetails) {
      updateNotification({
        id: 'loading-launch-data',
        title: 'Launch Data Loaded',
        message: `Successfully loaded SpaceX launch data for ${launchDetails?.name}.`,
        color: 'green',
        autoClose: 3000,
        withCloseButton: false,
      });
    }
  }, [launchDetails]);

  // Handle launch data loading errors
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

  // Image preview handler
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpened(true);
  };

  // Loading screen
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
      {/* Back Button */}
      <Button
        variant="light"
        onClick={() => navigate('/private/spacexresourcelistpage')}
        style={{ marginBottom: '1rem' }}
      >
        ← Back to SpaceX Resource List
      </Button>

      <LogoutButton />

      <Card shadow="lg" padding="lg" radius="md" withBorder style={{ backgroundColor: '#f9f9f9', borderRadius: '16px' }}>
        <Title order={2} mb="lg" align="center" style={{ fontWeight: 700, fontSize: '1.5rem', color: '#2C3E50' }}>
          Launch Details for {launchDetails?.name || 'Unknown Launch'}
        </Title>

        <Group spacing="xl" position="center">
          <Text><strong>Date:</strong> {new Date(launchDetails?.date_utc).toLocaleDateString()}</Text>
          <Text><strong>Flight Number:</strong> {launchDetails?.flight_number}</Text>
          <Text><strong>Success:</strong> {launchDetails?.success ? <Badge color="green" variant="filled">Yes</Badge> : <Badge color="red" variant="filled">No</Badge>}</Text>
        </Group>

        <Divider my="md" />

        <Text mt="sm" align="center" color="dimmed"><strong>Details:</strong> {launchDetails?.details || 'No details available'}</Text>

        {/* Fairing Details */}
        {launchDetails?.fairings && (
          <Paper shadow="xs" p="md" radius="lg" mt="lg" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
            <Title order={4} align="center" style={{ color: '#2980B9' }}>Fairing Details</Title>
            <Group spacing="xl" position="center" mt="md">
              <Text><strong>Reused:</strong> {launchDetails?.fairings?.reused ? 'Yes' : 'No'}</Text>
              <Text><strong>Recovery Attempt:</strong> {launchDetails?.fairings?.recovery_attempt ? 'Yes' : 'No'}</Text>
              <Text><strong>Recovered:</strong> {launchDetails?.fairings?.recovered ? 'Yes' : 'No'}</Text>
            </Group>
          </Paper>
        )}

        {/* Useful Links */}
        <Title order={4} mt="lg" align="center" style={{ color: '#2980B9' }}>Useful Links</Title>
        <Group position="center" mt="md">
          <Button component="a" href={launchDetails?.links?.webcast} target="_blank" rel="noopener noreferrer" variant="light" color="blue">
            Webcast
          </Button>
          <Button component="a" href={launchDetails?.links?.article} target="_blank" rel="noopener noreferrer" variant="light" color="blue">
            Article
          </Button>
          <Button component="a" href={launchDetails?.links?.wikipedia} target="_blank" rel="noopener noreferrer" variant="light" color="blue">
            Wikipedia
          </Button>
        </Group>

        {/* Core Details */}
        {launchDetails?.cores && launchDetails?.cores.length > 0 && (
          <Paper shadow="xs" p="md" radius="lg" mt="lg" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
            <Title order={4} align="center" style={{ color: '#2980B9' }}>Core Details</Title>
            {launchDetails?.cores.map((core: any, index: number) => (
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

        {isLoadingRocket && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Loader size="lg" variant="dots" />
          </div>
        )}

        {errorRocket && <Text color="red" align="center">Error loading rocket details.</Text>}

        {rocketDetails && (
          <Paper shadow="md" p="md" radius="lg" mt="lg" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
            <Title order={3} align="center" style={{ color: '#2C3E50', fontWeight: 700 }}>Rocket Details: {rocketDetails?.name}</Title>
            <Group spacing="xl" position="center" mt="md">
              <Text><strong>Height:</strong> {rocketDetails?.height?.meters} meters</Text>
              <Text><strong>Diameter:</strong> {rocketDetails?.diameter?.meters} meters</Text>
              <Text><strong>Mass:</strong> {rocketDetails?.mass?.kg} kg</Text>
              <Text><strong>First Flight:</strong> {rocketDetails?.first_flight}</Text>
              <Text><strong>Country:</strong> {rocketDetails?.country}</Text>
            </Group>
            <Text mt="sm" align="center" color="dimmed"><strong>Description:</strong> {rocketDetails?.description}</Text>

            {/* Rocket First Stage */}
            <Title order={4} mt="lg" align="center" style={{ color: '#2980B9' }}>First Stage</Title>
            <Group spacing="xl" position="center" mt="md">
              <Text><strong>Thrust (Sea Level):</strong> {rocketDetails?.first_stage?.thrust_sea_level?.kN} kN</Text>
              <Text><strong>Thrust (Vacuum):</strong> {rocketDetails?.first_stage?.thrust_vacuum?.kN} kN</Text>
              <Text><strong>Reusable:</strong> {rocketDetails?.first_stage?.reusable ? 'Yes' : 'No'}</Text>
            </Group>

            {/* Rocket Second Stage */}
            <Title order={4} mt="lg" align="center" style={{ color: '#2980B9' }}>Second Stage</Title>
            <Group spacing="xl" position="center" mt="md">
              <Text><strong>Thrust:</strong> {rocketDetails?.second_stage?.thrust?.kN}</Text>
              <Text><strong>Fuel Amount:</strong> {rocketDetails?.second_stage?.fuel_amount_tons} tons</Text>
              <Text><strong>Burn Time:</strong> {rocketDetails?.second_stage?.burn_time_sec} seconds</Text>
            </Group>

            {/* Payload Weights */}
            {rocketDetails?.payload_weights && rocketDetails?.payload_weights.length > 0 && (
              <Paper shadow="xs" p="md" radius="lg" mt="lg" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
                <Title order={4} align="center" style={{ color: '#2980B9' }}>Payload Weights</Title>
                {rocketDetails?.payload_weights.map((payload: any, index: number) => (
                  <Group key={index} spacing="xl" position="center">
                    <Text><strong>{payload?.name}:</strong> {payload?.kg} kg ({payload?.lb} lb)</Text>
                  </Group>
                ))}
              </Paper>
            )}

            {/* Flickr Images with Preview */}
            <Title order={4} mt="lg" align="center" style={{ color: '#2980B9' }}>Gallery Photos</Title>
            <Grid mt="md">
              {rocketDetails?.flickr_images?.map((image: string, index: number) => (
                <Grid.Col span={4} key={index}>
                  <Image
                    src={image}
                    alt={`Rocket Image ${index}`}
                    radius="md"
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
