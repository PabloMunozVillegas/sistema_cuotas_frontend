// Card.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Card = ({ title, carnet, nombre, onMoreInfo, onPay, onAdd, onEdit, onDelete }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-2"><strong>Carnet de Identidad:</strong> {carnet}</p>
        <p><strong>Nombre:</strong> {nombre}</p>
        <div className="mt-4 flex justify-between">
            <button onClick={onPay} className="text-black px-4 py-2 rounded hover:bg-green-600">
                <FontAwesomeIcon icon={faDollarSign} />
            </button>
            <button onClick={onAdd} className="text-black px-4 py-2 rounded hover:bg-blue-400">
                <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={onEdit} className="text-black px-4 py-2 rounded hover:bg-yellow-400">
                <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={onDelete} className="text-black px-4 py-2 rounded hover:bg-red-600">
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    </div>
);

export default Card;
