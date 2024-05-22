// App.js
import React from 'react';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import Formulario from './components/Formulario';
import PaginaInicio from './PaginaInicio';
import Inicio from './PaginaInicio/components/Inicio';
import VistaRegistroClien from './PaginaInicio/VistaRegistroCliente';
import ListaClientes from './PaginaRegistroUsuario';

function App() {
  const token = localStorage.getItem('token');
  
  return (
    <div>
        <Routes>
          <Route path="/" element={<Formulario />} />
          {token ? (
            <Route path="/Inicio" element={<PaginaInicio/> }>
              <Route path="/Inicio" element={<Inicio />} />
              <Route path="/Inicio/RegistraTuCliente" element={<VistaRegistroClien />} />
              <Route path="/Inicio/ListaDeClientes" element={<ListaClientes/>} />
            </Route>
          ) : (
            <Route path="/" element={<Formulario/>} />
          )}
        </Routes>
    </div>
  );
}

export default App;
