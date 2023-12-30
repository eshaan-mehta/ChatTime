import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Authenticate from "./Pages/Authenticate";
import Footer from "./Components/Footer";
import Chats from "./Pages/Chats";

const App = () => {
  return (
    <div className="bg-gray-900 bg-cover">
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/auth" element={<Authenticate/>} />
        <Route path="/chats" element={<Chats/>} />
      </Routes>
      
      <Footer/>
    </div>
      
  );
}

export default App;
