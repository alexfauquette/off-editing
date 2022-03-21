import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
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

        <HashRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/:campagne/admin" element={<CampagneAdmin />} />
            <Route path="/:campagne/:state" element={<ProductEdition />} />
            <Route path="/:campagne" element={<CampagneOverview />} />
          </Routes>
        </HashRouter>
      </div>
    </Provider>
  );
}

export default App;
