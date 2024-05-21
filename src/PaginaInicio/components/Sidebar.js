import React from 'react';

const Sidebar = () => {
    return (
        <div className="h-full w-64 bg-gray-900 text-white fixed top-0 left-0 flex flex-col p-4">
            <h2 className="text-lg font-bold mb-4">Sidebar</h2>
            <ul>
                <li className="mb-2">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Registrar Cliente</a>
                </li>
                <li className="mb-2">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Seguimiento de Pagos</a>
                </li>
                <li className="mb-2">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Generar Reportes</a>
                </li>
                {/* Agrega más elementos de menú según sea necesario */}
            </ul>
        </div>
    );
};

export default Sidebar;