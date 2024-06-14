import React, { useEffect, useState } from 'react';
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
import ListaCuotas from './InicioDeSesionParaTodos/PaginasClientes';
import VistaMasDetalle from './InicioDeSesionParaTodos/PaginasClientes/VistaMasDetalle';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<InicioSesion setToken={setToken} />} />
        {token ? (
          <>
            <Route path="/Inicio" element={<PaginaInicio />}>
              <Route path="/Inicio" element={<Inicio />} />
              <Route path="VistaDeClientes" element={<ListaClientes />} />
              <Route path="VistaDeProductos" element={<ListaProducto />} />
              <Route path="VistaDePago" element={<ListaPago />} />
              <Route path="VistaInfo" element={<VistaGeneral />} />
              <Route path="VistaDeCuotas" element={<FormuCuotas />} />
            </Route>
            <Route path="/Pendientes" element={<ListaCuotas />} />
            <Route path="/Pendientes/MasDetalle/:cuotaId" element={<VistaMasDetalle />} />
          </>
        ) : (
          <Route path="/*" element={<EsteNoEsElUsuario />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
