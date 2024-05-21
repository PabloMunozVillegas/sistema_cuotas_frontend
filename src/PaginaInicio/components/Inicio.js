import React from 'react';

const Inicio = () => {
    return (
        <div className="p-8 bg-white flex flex-col justify-center min-h-screen">
            
            <div className="w-full max-w-screen-lg   overflow-hidden break-words"> {/* Usar max-w-screen-lg para un contenedor amplio */}
                <h1 className="text-4xl font-bold text-gray-700 break-words">
                    Hola Astronautas jajjajjakjsakjsaksjalsjalggggggggggggggggggggggggggggggggggggsssssssssssssstttttttttttttttttttttttttttttttttttttttttttttttttttttttttttggggggggggggggggoooooooooooooooooooooooooRRRRRRRRRRRRRRRRRRRRRRRRRRRS
                </h1>
                <p className="mt-4 break-words">
                    Aquí puedes agregar más texto o cualquier contenido adicional que necesites.
                    La idea es mantener todo dentro de este contenedor para que no se desborde.
                </p>
            </div>
        </div>
    );
};

export default Inicio;