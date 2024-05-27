import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VistaGeneral = () => {
    const location = useLocation();
    const cliente = location.state && location.state.cliente;
    const navigate = useNavigate();

    const handlePagoClick = () => {
        navigate('/Inicio/VistaDePago');
    };


    return (
        <div className="p-8 bg-white shadow-md rounded-lg">
            {cliente ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block font-semibold">Carnet de Identidad</label>
                            <p className="border p-2 rounded">{cliente.cedulaIdentidad}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Nombre</label>
                            <p className="border p-2 rounded">{cliente.nombres}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Apellidos</label>
                            <p className="border p-2 rounded">{cliente.apellidos}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Email</label>
                            <p className="border p-2 rounded">{cliente.email}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Celular</label>
                            <p className="border p-2 rounded">{cliente.telefono}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Dirección</label>
                            <p className="border p-2 rounded">{cliente.direccion}</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block font-semibold">Productos</label>
                        {/* Display product information here */}
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handlePagoClick}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Ir a Pago
                        </button>
                    </div>
                </>
            ) : (
                <p>Selecciona un cliente para ver su información.</p>
            )}
        </div>
    );
};

export default VistaGeneral;
