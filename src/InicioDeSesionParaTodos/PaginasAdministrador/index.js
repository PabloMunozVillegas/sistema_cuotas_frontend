import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBoxOpen, faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons';

const PaginaInicio = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const showSidebar = !location.pathname.includes('/Pendientes');

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-full">
            {showSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
            <button 
                onClick={toggleSidebar} 
                className={`fixed top-4 left-4 z-50 p-2 bg-transparent text-gray-600 hover:text-gray-800 focus:outline-none transition-all duration-300 md:block hidden ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            
            {/* Línea separadora */}
            <div className="fixed bottom-16 left-0 right-0 h-px bg-gray-300 md:hidden"></div>

            {/* Menú inferior */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 py-1 bg-gray-100 text-black text-center text-base font-bold md:hidden flex justify-around`}>
                <Link to="/Inicio/VistaDeClientes" className="flex flex-col items-center group">
                    <FontAwesomeIcon icon={faUsers} size="lg" className="text-black mb-1 group-hover:text-lime-500 group-hover:stroke-black group-hover:stroke-1 transition-all duration-200 transform group-hover:-translate-y-1" />
                    <span className="text-xs text-black">Clientes</span>
                </Link>
                <Link to="/Inicio/VistaDeProductos" className="flex flex-col items-center group">
                    <FontAwesomeIcon icon={faBoxOpen} size="lg" className="text-black mb-1 group-hover:text-lime-500 group-hover:stroke-black group-hover:stroke-1 transition-all duration-200 transform group-hover:-translate-y-1" />
                    <span className="text-xs text-black">Productos</span>
                </Link>
                <Link to="/Inicio/VistaDeCuotas" className="flex flex-col items-center group">
                    <FontAwesomeIcon icon={faMoneyCheckAlt} size="lg" className="text-black mb-1 group-hover:text-lime-500 group-hover:stroke-black group-hover:stroke-1 transition-all duration-200 transform group-hover:-translate-y-1" />
                    <span className="text-xs text-black">Cuotas</span>
                </Link>
            </div>

            {/* Contenedor principal */}
            <div className={`flex-1 ${isSidebarOpen && showSidebar ? 'md:ml-64' : ''} max-w-full overflow-x-hidden transition-all duration-300 ease-in-out pb-28`}>
                <Outlet />
            </div>
        </div>
    );
};

export default PaginaInicio;