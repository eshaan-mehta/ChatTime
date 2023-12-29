import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Authenticate from "./Pages/Authenticate";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <div className="bg-gray-900 bg-cover">

      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/auth" element={<Authenticate/>} />
        </Routes>
      </BrowserRouter>

      <Footer/>
    </div>
      
  );
}

export default App;
