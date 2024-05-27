import React, { useState } from 'react';

const ListaPago = () => {
    return (
        <div className="p-8 bg-white flex flex-col justify-center min-h-screen">
            <div className="w-full max-w-screen-lg mx-auto">
                <h1 className="text-4xl font-bold text-gray-700 mb-4">TOTAL A PAGAR</h1>
                <div className="text-center text-3xl font-bold mb-8"> bs</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <p className="text-lg"><strong>Nombre Cliente:</strong></p>
                        <p className="text-lg"><strong>Cuotas pendientes:</strong></p>
                        <p className="text-lg"><strong>Monto cuota pendiente (más antigua):</strong> bs</p>
                    </div>
                </div>
                <form className="space-y-4">
                    <div>
                        <input
                            type="radio"
                            id="total"
                            name="opcionPago"
                            value="total"
                            className="mr-2"
                        />
                        <label htmlFor="total" className="text-lg">Total a pagar</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="cuota"
                            name="opcionPago"
                            value="cuota"
                            className="mr-2"
                        />
                        <label htmlFor="cuota" className="text-lg">Cuota antigua a pagar</label>
                    </div>
                        <div className="mt-4">
                            <label htmlFor="cuotasASeleccionar" className="text-lg mr-2">Selecciona la cantidad de cuotas a pagar:</label>
                            <select 
                                id="cuotasASeleccionar"  
                                className="p-2 border border-gray-300 rounded"
                            >
                            </select>
                        </div>
                    <div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Generar QR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListaPago;