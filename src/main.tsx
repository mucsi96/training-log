import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TokenClientProvider } from './TokenClientProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TokenClientProvider>
      <App />
    </TokenClientProvider>
  </React.StrictMode>
);
