import React, { useState } from 'react';

const ModalPago = ({ onClose, montoRestante }) => {
    const [metodoPago, setMetodoPago] = useState('qr'); // Estado para el método de pago seleccionado
    const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga durante el pago

    const handleMetodoPagoChange = (event) => {
        setMetodoPago(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        // Simulación de la lógica de pago
        try {
            // Aquí implementarías la lógica real para procesar el pago con el método seleccionado
            // Por ejemplo, podrías enviar una solicitud al servidor para procesar el pago
            await realizarPago(); // Función de ejemplo para simular el proceso de pago

            // Si el pago es exitoso, puedes cerrar el modal y realizar otras acciones necesarias
            alert('Pago realizado exitosamente');
            onClose();
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Hubo un error al procesar el pago. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Función de ejemplo para simular el proceso de pago
    const realizarPago = async () => {
        // Aquí podrías implementar la lógica real para procesar el pago
        // Por ejemplo, enviar una solicitud al servidor, procesar el pago con el método seleccionado, etc.
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(); // Simulación de pago exitoso después de un tiempo
            }, 2000); // Simulación de retardo de 2 segundos
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="bg-white p-8 rounded-lg shadow-lg z-10 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Realizar Pago</h2>
                <p><strong>Monto a Pagar:</strong> {montoRestante} Bs</p>

                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700">
                            Método de Pago
                        </label>
                        <select
                            id="metodoPago"
                            name="metodoPago"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={metodoPago}
                            onChange={handleMetodoPagoChange}
                        >
                            <option value="qr">Pago QR</option>
                            <option value="otro">Otro método de pago</option>
                        </select>
                    </div>

                    {/* Aquí podrías añadir campos adicionales según el método de pago seleccionado */}

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onClose}
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition duration-300 mr-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Realizar Pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalPago;
