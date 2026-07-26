import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// Buscamos el elemento 'root' creado en el index.html y montamos React sobre él
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
