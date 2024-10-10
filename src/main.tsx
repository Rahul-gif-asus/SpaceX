// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';
import SpaceXResourceList from './pages/SpaceXResourceList';
import SpaceXDetailPage from './pages/SpaceXDetailPage';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Import Firebase and Analytics
import { analytics } from './firebase';  // Assuming firebase.js is correctly set up

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      {
        path: '/private',
        element: <PrivateRoute />,
        children: [
          { path: 'spacexresourcelistpage', element: <SpaceXResourceList /> },
          { path: 'spacexdetailpage/:id', element: <SpaceXDetailPage /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 15,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications />
        <SpeedInsights /> {/* You can keep this or remove if not needed */}
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// Firebase analytics will be initialized upon app start
console.log('Firebase Analytics initialized', analytics);
