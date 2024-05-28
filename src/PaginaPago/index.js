import React, { useState, useEffect } from 'react';

const ListaPago = () => {
    const [cuotaParaPago, setCuotaParaPago] = useState(null);
    const [opcionPago, setOpcionPago] = useState('');
    const [pagosSeleccionados, setPagosSeleccionados] = useState([]);
    const [totalAPagar, setTotalAPagar] = useState(0);
    const [montoPagoSeleccionado, setMontoPagoSeleccionado] = useState(0);

    useEffect(() => {
        // Obtener datos del localStorage al montar el componente
        const datosPagoString = localStorage.getItem('datosPago');
        if (datosPagoString) {
            const datosPago = JSON.parse(datosPagoString);
            setCuotaParaPago(datosPago);
        }
    }, []);

    useEffect(() => {
        if (opcionPago && cuotaParaPago) {
            if (opcionPago === 'total') {
                setTotalAPagar(montoPagoSeleccionado);
            } else {
                let total = 0;
                pagosSeleccionados.forEach(pagoId => {
                    const index = cuotaParaPago.idPagos.indexOf(pagoId);
                    if (index !== -1) {
                        total += cuotaParaPago.montosPagar[index];
                    }
                });
                setTotalAPagar(total);
            }
        }
    }, [opcionPago, cuotaParaPago, pagosSeleccionados, montoPagoSeleccionado]);

    const handleOpcionPagoChange = (event) => {
        setOpcionPago(event.target.value);
    };

    const handlePagoSeleccionado = (event) => {
        const pagoSeleccionado = event.target.value;
        const index = cuotaParaPago.idPagos.indexOf(pagoSeleccionado);
        if (event.target.checked && index !== -1) {
            setPagosSeleccionados(prev => [...prev, pagoSeleccionado]);
            setMontoPagoSeleccionado(cuotaParaPago.montosPagar[index]);
        } else {
            setPagosSeleccionados(prev => prev.filter(item => item !== pagoSeleccionado));
            setMontoPagoSeleccionado(0);
        }
    };

    return (
        <div className="p-8 bg-white flex flex-col justify-center min-h-screen">
            <div className="w-full max-w-screen-lg mx-auto">
                <h1 className="text-4xl font-bold text-gray-700 mb-4">Total a Pagar: {opcionPago === 'total' ? totalAPagar : montoPagoSeleccionado} Bs</h1>
                {cuotaParaPago && (
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block font-semibold mb-2">Nombre del Cliente</label>
                            <p>{cuotaParaPago.nombreUsuario}</p>
                        </div>
                        <div className="block font-semibold mb-2">
                            <label>Pagos Disponibles</label>
                            <div className="flex flex-col">
                                {cuotaParaPago.idPagos.map((pagoId, index) => (
                                    <div key={pagoId} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={pagoId}
                                            checked={pagosSeleccionados.includes(pagoId)}
                                            onChange={handlePagoSeleccionado}
                                            className="mr-2"
                                        />
                                        <p>Pago {index + 1}: {cuotaParaPago.montosPagar[index]} Bs</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListaPago;
