import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./input.css"
import ChatProvider from './Context/ChatProvider';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChatProvider>
        <App />
    </ChatProvider>
  </BrowserRouter>
);

