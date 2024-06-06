import React from 'react';
import { APIFunctions } from '../axiosInstance';

const ModalEliminar = ({ clientId, onClose, updateClientData, token }) => {
    const handleEliminarCliente = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await APIFunctions.autenticacion.delete(clientId, token);
            console.log("Cliente eliminado con éxito:", response);
            onClose(true); 
            updateClientData(); 
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
            alert('Hubo un error al eliminar el cliente. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-4 max-w-[80%] w-full md:max-w-md relative">
                <button onClick={() => onClose(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className="text-xl md:text-lg font-bold text-gray-700">Eliminar Cliente</h1>
                <p className="my-4">¿Estás seguro de que quieres eliminar este cliente?</p>
                <div className="flex justify-end">
                    <button onClick={handleEliminarCliente} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4">
                        Sí, Eliminar
                    </button>
                    <button onClick={() => onClose(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEliminar;
