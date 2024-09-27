import React from 'react';
import { Button, Group, Text, Container, SimpleGrid } from '@mantine/core';
import { IconRocket, IconSearch, IconLayoutGrid } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom'; // To navigate to login page
import './css/Landing.scss';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <Container>
          <div className="header-content">
            <h1>SpaceX Launch Explorer</h1>
            <nav>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Home
                  </a>
                </li>
                <li><a href="#about">About Us</a></li>
                <li><a href="/login">Login</a></li>
              </ul>
            </nav>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <div className="hero-content">
            <h2>
              Explore the latest SpaceX launches and stay updated with real-time data.
              Your gateway to the stars starts here!
            </h2>
            <Group position="center" mt="lg">
              <Button
                size="lg"
                radius="xl"
                color="blue"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                radius="xl"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Learn More
              </Button>
            </Group>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <Container>
          <Text size="lg" weight={700} align="center" mt="xl" mb="md">Why Choose Our Explorer?</Text>
          <SimpleGrid cols={3} spacing="xl" mt="md" breakpoints={[
            { maxWidth: 'md', cols: 1 }, // Make grid responsive on smaller screens
            { maxWidth: 'sm', cols: 1 }
          ]}>
            <div className="feature">
              <IconRocket size={60} color="blue" />
              <Text size="lg" weight={500} align="center" mt="sm">Real-Time Data</Text>
              <Text color="dimmed" align="center" size="sm">
                Stay updated with the latest launches and rocket information directly from SpaceX’s API.
              </Text>
            </div>
            <div className="feature">
              <IconSearch size={60} color="green" />
              <Text size="lg" weight={500} align="center" mt="sm">Advanced Filtering & Sorting</Text>
              <Text color="dimmed" align="center" size="sm">
                Easily search, filter, and sort launches to find exactly what you're looking for.
              </Text>
            </div>
            <div className="feature">
              <IconLayoutGrid size={60} color="orange" />
              <Text size="lg" weight={500} align="center" mt="sm">Beautiful UI</Text>
              <Text color="dimmed" align="center" size="sm">
                Enjoy a clean, modern interface designed to offer a seamless experience on all devices.
              </Text>
            </div>
          </SimpleGrid>
        </Container>
      </section>

      {/* Call-to-Action */}
      <section className="call-to-action">
        <Container>
          <Text size="xl" weight={700} align="center" mt="xl" mb="md">Join the community of space enthusiasts!</Text>
          <Group position="center">
            <Button
              size="lg"
              radius="xl"
              color="blue"
              onClick={() => window.open('https://discord.gg/3aPrbQd2Xb', '_blank')}
            >
              Join Discord
            </Button>
          </Group>
        </Container>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Container>
          <div className="footer-content">
            <Text align="center">© 2024 SpaceX Launch Explorer</Text>
            <nav>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Landing;
