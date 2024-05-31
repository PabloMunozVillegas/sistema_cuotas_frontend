// ListaPago.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCliente } from './ClienteContext';

const ListaPago = () => {
    const { clienteSeleccionado } = useCliente();
    const [cuotaParaPago, setCuotaParaPago] = useState(null);
    const [opcionPago, setOpcionPago] = useState('');
    const [cuotaSeleccionada, setCuotaSeleccionada] = useState('');
    const [totalAPagar, setTotalAPagar] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCuotas = async () => {
            if (clienteSeleccionado && clienteSeleccionado._id) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:3001/api/cuotas/usuario/${clienteSeleccionado._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setCuotaParaPago(response.data);
                } catch (error) {
                    console.error('Error al obtener las cuotas del usuario:', error);
                }
            }
        };
        fetchCuotas();
    }, [clienteSeleccionado]);

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
    };

    const handleModalConfirm = () => {
        registrarPago();
        localStorage.removeItem('datosPago');
        setModalVisible(false);
    };

    const registrarPago = () => {
        const data = {
            idPago: [cuotaSeleccionada],
        };
        const cliente = clienteSeleccionado._id;
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:3001/api/pagos/create/${cliente}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                toast.success('Pago realizado');
                setTimeout(() => {
                    navigate('/Inicio/VistaInfo', { state: { cliente: clienteSeleccionado } }); // Pasar el cliente en la navegación
                }, 2000);
            })
            .catch(error => {
                toast.error('Error al registrar el pago:', error.message);
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
                            <p>{clienteSeleccionado.nombre}</p>
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
                        <button onClick={() => setModalVisible(true)}>Pagar</button>
                    </div>
                )}
            </div>
            {modalVisible && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded shadow-lg">
                        <p>¿Estás seguro de realizar este pago?</p>
                        <div className="flex justify-end mt-4">
                            <button className="mr-4" onClick={handleModalConfirm}>Sí</button>
                            <button onClick={() => setModalVisible(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ListaPago;
