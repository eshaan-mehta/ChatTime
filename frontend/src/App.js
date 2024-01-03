import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Authenticate from "./Pages/Authenticate";
import ChatsPage from "./Pages/ChatsPage";
import AboutPage from "./Pages/AboutPage";

const App = () => {
  return (
    <div className="bg-gray-900 bg-cover">
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/auth" element={<Authenticate/>} />
        <Route path="/chats" element={<ChatsPage/>} />
        <Route path="/about" element={<AboutPage/>} />
      </Routes>
    </div> 
  );
}

export default App;
