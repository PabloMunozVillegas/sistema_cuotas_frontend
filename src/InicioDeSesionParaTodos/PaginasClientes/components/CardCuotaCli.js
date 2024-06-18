import React from 'react';

const CardCuota = ({ cuota, pagos, navigate }) => {
    const handleMoreInfo = async () => {
        try {
            navigate(`/Pendientes/MasDetalle/${cuota._id}`, {
                state: {
                    detalleCuota: cuota,
                    pagos: pagos,
                }
            });
        } catch (error) {
            console.error('Error fetching detailed payment data:', error);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            {cuota.producto.map((producto, index) => (
                <div key={index}>
                    <h2 className="text-xl font-bold">{producto.nombreProducto}</h2>
                    <p><strong>Descripción:</strong> {producto.descripcion}</p>
                    <p><strong>Precio:</strong> {producto.precio} Bs</p>
                </div>
            ))}
            <p><strong>Cantidad de Cuotas:</strong> {cuota.cantidadCuotas}</p>
            <p><strong>Cuotas pagadas:</strong> {pagos.cantidadCuotasPagadas}</p>
            <p><strong>Total a pagar:</strong> {pagos.total} Bs</p>

            <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                onClick={handleMoreInfo}
            >
                Ver más detalles
            </button>
        </div>
    );
};

export default CardCuota;
