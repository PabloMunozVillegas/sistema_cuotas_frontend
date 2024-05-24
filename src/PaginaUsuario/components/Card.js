import React from 'react';

const Card = ({ title, carnet, nombre, onMoreInfo }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col ">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-2"><strong>Carnet de Identidad:</strong> {carnet}</p>
        <p><strong>Nombre:</strong> {nombre}</p>
        <button
            onClick={onMoreInfo}
            className="mt-4 text-black px-4 py-2 rounded hover:bg-lime-300"
        >
            Más Info +
        </button>
    </div>

);

export default Card;
