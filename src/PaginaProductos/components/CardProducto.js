import React from 'react';

const CardProducto = ({ title, nombre, descripcion, precio }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-2"><strong>Descripción:</strong> {descripcion}</p>
        <p><strong>Precio Unitario:</strong> Bs{precio}</p>
    </div>
);

export default CardProducto;