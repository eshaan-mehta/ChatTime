import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";

const App = () => {
  return (
    <div className="bg-gray-900 bg-cover">
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/login" element />
        </Routes>
      </BrowserRouter>

      <footer className='fixed bottom-3 right-2 px-4 text-center text-white '>
        <small className='mb-2 text-xs block'>
            &copy; 2023 Eshaan Mehta. All rights reserved.
        </small>
      </footer>
    </div>
      
  );
}

export default App;
