// App.js
import React from 'react';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import Formulario from './components/Formulario';
import PaginaInicio from './PaginaInicio/index';
import EsteNoEsElUsuario from './EsteNoEsElUsuario/index';

function App() {
  const token = localStorage.getItem('token');
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Formulario />} />
        {token ? (
          <Route path="/Inicio" element={<PaginaInicio />} />
        ) : (
          <Route path="/A donde vas?" element={<EsteNoEsElUsuario />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
