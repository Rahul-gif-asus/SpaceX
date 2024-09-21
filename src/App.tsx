import React from 'react';
import { Outlet } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div>
      <h1>App Component</h1>
      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

export default App;
