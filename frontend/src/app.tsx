import React from 'react';
import { MainPage } from './MainPage';

/**
 * Componente principal App
 * Carga directamente el componente MainPage para visualizar la interfaz sin errores de enrutamiento.
 */
function App() {
  return (
    <div className="app-container">
      <MainPage />
    </div>
  );
}

export default App;