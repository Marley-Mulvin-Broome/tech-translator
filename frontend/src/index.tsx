// import 'dotenv/config';
// import dotenv from 'dotenv'; // dotenv パッケージをインポート
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// dotenv.config();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


