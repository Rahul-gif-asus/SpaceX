// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import SpaceXResourceList from './pages/SpaceXResourceList';
import SpaceXDetailPage from './pages/SpaceXDetailPage';

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
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
