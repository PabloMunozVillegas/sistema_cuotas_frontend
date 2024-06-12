import React from 'react';

const EsteNoEsElUsuario = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="max-w-md text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">¡Error 404!</h1>
                <p className="text-lg text-gray-800 mb-4">Este no es el sitio que estás buscando.</p>
                <img src="/Imagen.jpg" alt="Error 404" className="mx-auto mb-8" />
                <a href="/" className="text-blue-600 hover:underline">Volver al inicio</a>
            </div>
        </div>
    );
};

export default EsteNoEsElUsuario;