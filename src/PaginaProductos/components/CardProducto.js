import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const CardProducto = ({ title, nombre, descripcion, precio, onEdit, onDelete }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-2"><strong>Descripción:</strong> {descripcion}</p>
        <p><strong>Precio Unitario:</strong> Bs{precio}</p>
        <div className="mt-4 flex justify-between">
            <button onClick={onEdit} className="text-black px-4 py-2 rounded hover:bg-yellow-400">
                <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={onDelete} className="text-black px-4 py-2 rounded hover:bg-red-600">
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    </div>
);

export default CardProducto;