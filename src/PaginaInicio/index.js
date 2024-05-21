import React from 'react';
import Inicio from './components/Inicio';
import Sidebar from './components/Sidebar';

const PaginaInicio = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 max-w-full overflow-x-hidden"> 
                <Inicio />
            </div>
        </div>
    );
};

export default PaginaInicio;