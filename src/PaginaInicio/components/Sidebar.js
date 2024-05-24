// Sidebar.js
import React from 'react';

const Sidebar = () => {
    return (
        <div className="h-full w-64 bg-gray-900 text-white fixed top-0 left-0 flex flex-col p-4">
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
    );
};

export default Sidebar;
