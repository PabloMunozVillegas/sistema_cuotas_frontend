// PaginaInicio.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const PaginaInicio = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : ''} max-w-full overflow-x-hidden transition-all duration-300 ease-in-out`}>
                <Outlet />
            </div>
            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default PaginaInicio;
