import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListaPago = () => {
    const [cuotaParaPago, setCuotaParaPago] = useState(null);
    const [opcionPago, setOpcionPago] = useState('');
    const [cuotaSeleccionada, setCuotaSeleccionada] = useState('');
    const [totalAPagar, setTotalAPagar] = useState(0);

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
                let total = 0;
                cuotaParaPago.montosPagar.forEach(monto => {
                    total += monto;
                });
                setTotalAPagar(total);
            } else {
                const index = parseInt(cuotaSeleccionada) - 1;
                if (!isNaN(index) && index >= 0 && index < cuotaParaPago.montosPagar.length) {
                    setTotalAPagar(cuotaParaPago.montosPagar[index]);
                }
            }
        }
    }, [opcionPago, cuotaParaPago, cuotaSeleccionada]);

    const handleOpcionPagoChange = (event) => {
        setOpcionPago(event.target.value);
    };

    const handleCuotaSeleccionadaChange = (event) => {
        setCuotaSeleccionada(event.target.value);
        console.log('ID de pago seleccionado:', event.target.value); 
    };
    

    const registrarPago = () => {
        const data = {
            idPago: [cuotaSeleccionada],
        };
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:3001/api/pagos/create/${cuotaParaPago.idUsuario}`, 
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
            .then(response => {
                console.log('Pago registrado exitosamente:', response.data);
            })
            .catch(error => {
                console.error('Error al registrar el pago:', error);
            });
    };
    
    

    return (
        <div className="p-8 bg-white flex flex-col justify-center min-h-screen">
            <div className="w-full max-w-screen-lg mx-auto">
                <h1 className="text-4xl font-bold text-gray-700 mb-4">Total a Pagar: {totalAPagar} Bs</h1>
                {cuotaParaPago && (
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block font-semibold mb-2">Nombre del Cliente</label>
                            <p>{cuotaParaPago.nombreUsuario}</p>
                        </div>
                        <div className="block font-semibold mb-2">
                            <label>Opción de Pago</label>
                            <div className="flex flex-col">
                                <select onChange={handleOpcionPagoChange} value={opcionPago}>
                                    <option value="">Seleccionar Opción</option>
                                    <option value="total">Total</option>
                                    <option value="cuota">Por Cuota</option>
                                </select>
                            </div>
                        </div>
                        {opcionPago === 'cuota' && (
                            <div className="block font-semibold mb-2">
                                <label>Cuota Seleccionada</label>
                                <div className="flex flex-col">
                                    <select onChange={handleCuotaSeleccionadaChange} value={cuotaSeleccionada}>
                                        <option value="">Seleccionar Cuota</option>
                                        {cuotaParaPago.idPagos.map((idPago, index) => ( 
                                            <option key={index} value={idPago}>Cuota {index + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        <button onClick={registrarPago}>Registrar Pago</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListaPago;
