import React from "react";
import { Router } from "@reach/router";

import store from "./redux/store";
import { Provider } from "react-redux";

import CampagneAdmin from "./pages/CampagneAdmin";
import ProductEdition from "./pages/ProductEdition";
import CampagneOverview from "./pages/CampagneOverview";
import WelcomePage from "./pages/WelcomePage";

import "./App.css";

import "./styles/rr.css";
import "./styles/rgl.css";

function App() {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <WelcomePage path="/" />
          <CampagneAdmin path="admin/:campagne" />
          <ProductEdition path="/:campagne/:state" />
          <CampagneOverview path="/:campagne" />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
