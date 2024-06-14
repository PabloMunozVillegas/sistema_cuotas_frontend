import React from 'react';

const CardCuota = ({ cuota, onMoreInfo }) => {
    const producto = cuota.producto[0]; // Asumiendo que hay al menos un producto en la cuota

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col">
            <h2 className="text-xl font-bold mb-2">{producto.nombreProducto}</h2>
            <p className="mb-2"><strong>Descripción:</strong> {producto.descripcion}</p>
            <p className="mb-2"><strong>Monto Total:</strong> {cuota.montoTotal} Bs</p>
            <p className="mb-2"><strong>Pago por Mes:</strong> {(cuota.montoTotal / cuota.cuotasTotales).toFixed(2)} Bs</p>
            <p><strong>Cuotas Totales:</strong> {cuota.cuotasTotales}</p>
            <button
                onClick={() => onMoreInfo(cuota._id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Más info
            </button>
        </div>
    );
};

export default CardCuota;
