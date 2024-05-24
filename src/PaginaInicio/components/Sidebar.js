// Sidebar.js
import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`h-full w-64 bg-gray-900 text-white fixed top-0 left-0 flex flex-col p-4 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold mr-4">SIS_COBRANZA</h2>
                {isOpen && (
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                )}
            </div>
            <div className="flex flex-col">
                <h2 className="text-lg font-bold mb-4">Sidebar</h2>
                <ul>
                    <li className="mb-2">
                        <a href="/Inicio/VistaDeClientes" className="text-gray-400 hover:text-white transition-colors duration-200">Vista de Clientes</a>
                    </li>
                    <li className="mb-2">
                        <a href="/Inicio/VistaDeProductos" className="text-gray-400 hover:text-white transition-colors duration-200">Vista de Productos</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
