import React from 'react';
import {Navbar, Toast} from './components';
import Routes from './routes';
import './main.scss';

const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <Toast />
      <Routes />
    </div>
  );
};

export default App;
