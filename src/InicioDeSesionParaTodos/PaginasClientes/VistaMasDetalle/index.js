import React, { useState, useEffect } from 'react';
import { APIFunctions } from '../../../axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import ModalPago from './components/ModalPago'; // Importar el componente ModalPago (implementación pendiente)

const VistaMasDetalle = () => {
    const { cuotaId } = useParams();
    const [detalleCuota, setDetalleCuota] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCuotas, setSelectedCuotas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetalleCuota = async () => {
            const token = localStorage.getItem('token');
            try {
                const responseCuota = await APIFunctions.pagos.urlIdUnico(cuotaId, token);
                console.log(responseCuota);
                setDetalleCuota(responseCuota);
                setPagos(responseCuota.pagos);
            } catch (error) {
                console.error('Error fetching payment data:', error);
            }
        };

        fetchDetalleCuota();
    }, [cuotaId]);

    useEffect(() => {
        const handleSwipeBack = (event) => {
            if (event.touches && event.changedTouches) {
                const touchStartX = event.touches[0]?.clientX;
                const touchEndX = event.changedTouches[0]?.clientX;
                const touchStartY = event.touches[0]?.clientY;
                const touchEndY = event.changedTouches[0]?.clientY;

                // Detectar un gesto de deslizamiento horizontal hacia la izquierda
                if (touchStartX && touchEndX && touchStartX - touchEndX > 50 && Math.abs(touchStartY - touchEndY) < 50) {
                    navigate(-1); // Navegar hacia atrás si el gesto de deslizamiento es suficiente
                }
            }
        };

        document.addEventListener('touchstart', handleSwipeBack);
        document.addEventListener('touchend', handleSwipeBack);

        return () => {
            document.removeEventListener('touchstart', handleSwipeBack);
            document.removeEventListener('touchend', handleSwipeBack);
        };
    }, [navigate]);

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
            // Simplemente acumular el monto total a pagar de las cuotas seleccionadas
            const montoTotalPagar = selectedCuotas.reduce((total, index) => {
                return total + detalleCuota.pagos[index].totalPagado;
            }, 0);

            // Aquí deberías implementar la lógica para crear un nuevo pago unificado
            // APIFunctions.pagos.crearPago(cuotaId, token, { /* Datos del pago */ });

            // Ejemplo: Crear un nuevo objeto de pago consolidado
            const nuevoPago = {
                fechaPago: new Date().toISOString(), // Fecha actual (ejemplo)
                totalPagado: montoTotalPagar,
                estadoPago: 'Pendiente' // Estado inicial (ejemplo)
            };

            // Actualizar el estado de pagos con el nuevo pago consolidado
            setPagos([...pagos, nuevoPago]);

            // Redirigir a la página de detalle de pago con los datos necesarios
            navigate('/historial-de-pagos/detalle-pago', {
                state: {
                    usuario: 'Usuario Ejemplo',
                    producto: detalleCuota.producto,
                    monto: montoTotalPagar.toFixed(2),
                    cuotasSeleccionadas: selectedCuotas
                }
            });
        } catch (error) {
            console.error('Error al realizar el pago:', error);
            // Manejar el error según sea necesario
        }
    };

    if (!detalleCuota) return <div>Cargando...</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{detalleCuota.producto}</h2>

                {/* Tabla de Cuotas */}
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
                            {detalleCuota.pagos.map((pago, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-2 px-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCuotas.includes(index)}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                    </td>
                                    <td className="py-2 px-4">{new Date(pago.fechaPago).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">{pago.totalPagado.toFixed(2)} Bs</td>
                                    <td className="py-2 px-4">{pago.estadoPago}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Resumen */}
                <h3 className="text-xl font-bold mt-6 mb-2">Resumen</h3>
                <p><strong>Total a Pagar:</strong> {selectedCuotas.length > 0 ? selectedCuotas.reduce((total, index) => total + detalleCuota.pagos[index].totalPagado, 0).toFixed(2) : '0.00'} Bs</p>

                {/* Botón Pagar */}
                <button
                    onClick={handleOpenModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300 mt-4"
                >
                    Pagar
                </button>

                {/* Modal de Pago */}
                {showModal && (
                    <ModalPago
                        onClose={handleCloseModal}
                        montoRestante={selectedCuotas.length > 0 ? selectedCuotas.reduce((total, index) => total + detalleCuota.pagos[index].totalPagado, 0).toFixed(2) : '0.00'}
                    />
                )}
            </div>
        </div>
    );
};

export default VistaMasDetalle;
