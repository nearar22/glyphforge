import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import { ForgeProvider } from './forge/ForgeContext.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ForgeProvider>
          <App />
        </ForgeProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
