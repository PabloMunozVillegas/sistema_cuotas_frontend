import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import FormuCuotas from './InicioDeSesionParaTodos/PaginasAdministrador/VistaGralCuotas';
import InicioSesion from './InicioDeSesionParaTodos/InicioSesion';
import PaginaInicio from './InicioDeSesionParaTodos/PaginasAdministrador';
import Inicio from './InicioDeSesionParaTodos/PaginasAdministrador/PrimeraVista';
import ListaClientes from './InicioDeSesionParaTodos/PaginasAdministrador/VistaGralUsuario';
import ListaProducto from './InicioDeSesionParaTodos/PaginasAdministrador/VistaGralProductos';
import ListaPago from './InicioDeSesionParaTodos/PaginasAdministrador/VistaGralPagos';
import VistaGeneral from './InicioDeSesionParaTodos/PaginasAdministrador/VistaGralUsuario/VistaInfo';
import EsteNoEsElUsuario from './InicioSesionParaBaneados';

function App() {
  const token = localStorage.getItem('token');
  return (
    <div>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        {token ? (
          <Route path="/Inicio" element={<PaginaInicio/> }>
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/Inicio/VistaDeClientes" element={<ListaClientes/>} />
            <Route path="/Inicio/VistaDeProductos" element={<ListaProducto/>} />
            <Route path="/Inicio/VistaDePago" element={<ListaPago/>} />
            <Route path="/Inicio/VistaInfo" element={<VistaGeneral/>}/>
            <Route path="/Inicio/VistaDeCuotas" element={<FormuCuotas/>} />
          </Route>
        ) : (
          <Route path="/*" element={<EsteNoEsElUsuario/>} />
        )}
      </Routes>
    </div>
  );
}

export default App;
