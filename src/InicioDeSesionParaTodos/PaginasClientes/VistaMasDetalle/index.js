import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalPago from './components/ModalPago';

const VistaMasDetalle = () => {
    const location = useLocation();
    const { detalleCuota, pagos, cliente } = location.state;
    const [showModal, setShowModal] = useState(false);
    const [selectedCuotas, setSelectedCuotas] = useState([]);
    const [montoTotalPagar, setMontoTotalPagar] = useState(0);
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCheckboxChange = (index) => {
        setSelectedCuotas(prevSelected => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter(i => i !== index);
            } else {
                return [...prevSelected, index];
            }
        });
    };

    const handlePagar = async () => {
        try {
            const token = localStorage.getItem('token');
            const montoTotal = selectedCuotas.reduce((total, index) => {
                return total + pagos.pagos[index].totalPagado; // Asegúrate de acceder correctamente a pagos.pagos[index]
            }, 0);

            setMontoTotalPagar(montoTotal);

            const nuevoPago = {
                fechaPago: new Date().toISOString(),
                totalPagado: montoTotal,
                estadoPago: 'Pendiente'
            };

            // Lógica para realizar el pago...

            navigate('/historial-de-pagos/detalle-pago', {
                state: {
                    usuario: 'Usuario Ejemplo',
                    producto: detalleCuota.producto,
                    monto: montoTotal.toFixed(2),
                    cuotasSeleccionadas: selectedCuotas,
                    cliente: cliente
                }
            });
        } catch (error) {
            console.error('Error al realizar el pago:', error);
        }
    };

    if (!detalleCuota) return <div>Cargando...</div>;

    const totalCuotas = pagos.pagos.reduce((total, pago) => total + pago.totalPagado, 0).toFixed(2);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{detalleCuota.nombreProducto}</h2>

                {cliente && (
                    <div>
                        <p><strong>Cliente:</strong> {cliente.nombres} {cliente.apellidos}</p>
                        <p><strong>Cédula de Identidad:</strong> {cliente.cedulaIdentidad}</p>
                    </div>
                )}

                <h3 className="text-xl font-bold mt-6 mb-2">Monto Total: {detalleCuota.montoTotal} Bs</h3>
                <h4 className="text-lg font-bold mt-4 mb-2">Monto del Pago: {totalCuotas} Bs</h4>

                <h3 className="text-xl font-bold mt-6 mb-2">Tabla de Cuotas</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b border-gray-200">Seleccionar</th>
                                <th className="py-2 px-4 border-b border-gray-200">Fecha Límite de Pago</th>
                                <th className="py-2 px-4 border-b border-gray-200">Monto a Pagar</th>
                                <th className="py-2 px-4 border-b border-gray-200">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagos.pagos.map((pago, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-2 px-4">
                                        {pago.estadoPago === 'Pendiente' && (
                                            <input
                                                type="checkbox"
                                                checked={selectedCuotas.includes(index)}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString() : 'Sin fecha'}
                                    </td>
                                    <td className="py-2 px-4">{pago.totalPagado} Bs</td>
                                    <td className="py-2 px-4">{pago.estadoPago}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                    onClick={handlePagar}
                >
                    Pagar Seleccionados
                </button>

                {showModal && (
                    <ModalPago
                        closeModal={handleCloseModal}
                        totalPagar={montoTotalPagar}
                        cuotasSeleccionadas={selectedCuotas}
                    />
                )}
            </div>
        </div>
    );
};

export default VistaMasDetalle;
