// PaginaInicio.js
import React from 'react';
import { Outlet} from 'react-router-dom'; 
import Sidebar from './components/Sidebar';


const PaginaInicio = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 max-w-full overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default PaginaInicio;
