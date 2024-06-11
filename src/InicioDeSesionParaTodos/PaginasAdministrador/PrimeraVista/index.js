import React from 'react';
import FechayHora from '../../../components/FechaHora';

const Inicio = () => {
    

    return (
        <div className="p-8 bg-white flex flex-col justify-center">
        <div className="w-full max-w-screen-lg mx-auto flex justify-between items-center mb-4">
            <FechayHora />
        </div>
        <div className="w-full max-w-screen-lg overflow-hidden break-words">
            <h1 className="text-4xl font-bold text-gray-700 break-words">
                Bienvenido
            </h1>
            <p className="mt-4 break-words justify-center">
                Se plantea un inicio llamativo 
            </p>
        </div>
    </div>
    );
};

export default Inicio;