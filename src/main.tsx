import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import Landing from './pages/Landing';
import Login from './pages/Login'; // Import the Login page
import PrivatePage from './pages/PrivatePage'; // Import the Private page
import SpaceXResourceList from './pages/SpaceXResourceList';
import SpaceXDetailPage from './pages/SpaceXDetailPage'; 
export const routes = [
  {
    path: '/',
    element: <App />, // This will render the App component with Outlet for children
    children: [
      {
        path: '/', // Root path for the landing page
        element: <Landing />,
      },
      {
        path: '/login', // Define the login route
        element: <Login />,
      },
      {
        path: '/private', // Define the private route
        element: <PrivatePage />,
      },
      {
        path: '/spacex',
        element: <SpaceXResourceList />
      },
      { path: '/spacex/launches/:id', 
        element: <SpaceXDetailPage /> 
      }
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
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
