import React from 'react';
import { Router } from "@reach/router"

import store from './redux/store'
import { Provider } from 'react-redux'

import GridLayout from "react-grid-layout";
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import CampagneAdmin from './pages/CampagneAdmin'
import ProductEdition from './pages/ProductEdition'
import CampagneOverview from './pages/CampagneOverview'

import './App.css';

import './styles/rr.css'
import './styles/rgl.css'



// Create a client

function App() {
  return (

    <Provider store={store}>
      <div>
        <Router>
          <CampagneAdmin path="admin/:campagne" />
          <ProductEdition path="/:campagne/:state" />
          <CampagneOverview path="/:campagne" />
        </Router>
      </div>
    </Provider>
  );
}

export default App;

