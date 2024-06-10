import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { APIFunctions } from '../axiosInstance';

const ListaPago = () => {
    const [cuotaParaPago, setCuotaParaPago] = useState(null);
    const [opcionPago, setOpcionPago] = useState('');
    const [cuotasSeleccionadas, setCuotasSeleccionadas] = useState([]);
    const [totalAPagar, setTotalAPagar] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const datosPagoString = localStorage.getItem('datosPago');
        if (datosPagoString) {
            const datosPago = JSON.parse(datosPagoString);
            setCuotaParaPago(datosPago);
        }
    }, []);

    useEffect(() => {
        if (opcionPago && cuotaParaPago) {
            if (opcionPago === 'total') {
                setTotalAPagar(cuotaParaPago.totalaApagar);
            } else {
                let total = 0;
                cuotasSeleccionadas.forEach(index => {
                    total += cuotaParaPago.montosPagar[index];
                });
                setTotalAPagar(total);
            }
        }
    }, [opcionPago, cuotaParaPago, cuotasSeleccionadas]);

    const handleOpcionPagoChange = (event) => {
        const selectedOption = event.target.value;
        setOpcionPago(selectedOption);
        if (selectedOption === 'total') {
            setCuotasSeleccionadas([]);
        }
    };

    const handleCuotaSeleccionadaChange = (event, index) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setCuotasSeleccionadas(prevState => [...prevState, index]);
        } else {
            setCuotasSeleccionadas(prevState => prevState.filter(item => item !== index));
        }
    };

    const handleModalConfirm = () => {
        registrarPago();
        setModalVisible(false);
    };

    const navigateToVistaDePago = () => {
        navigate('/Inicio/VistaDePago', { state: { clienteId: cuotaParaPago.idUsuario } });
    };

    const registrarPago = async () => {
        try {
            const token = localStorage.getItem('token');
            let cuotasPagar = [];

            if (opcionPago === 'total') {
                cuotasPagar = cuotaParaPago.pagosId;
            } else if (opcionPago === 'cuota' && cuotasSeleccionadas.length > 0) {
                cuotasPagar = cuotasSeleccionadas.map(index => cuotaParaPago.pagosId[index]);
            } else {
                console.log('No se seleccionaron cuotas');
                return;
            }

            const enlace = cuotaParaPago.cuotaSeleccionadaId;
            const data = cuotasPagar;
            const response = await APIFunctions.pagos.create(data, enlace, token);
            toast.success('Pago realizado con éxito!');
            navigateToVistaDePago();
        } catch (error) {
            console.error('Error al registrar el pago:', error);
            toast.error('Error al registrar el pago');
        }
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
                            <div>
                                <label className="block font-semibold mb-2">Cuotas Disponibles</label>
                                <div className="flex flex-col">
                                    {cuotaParaPago.nombreCuota.map((nombre, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={cuotasSeleccionadas.includes(index)}
                                                onChange={(event) => handleCuotaSeleccionadaChange(event, index)}
                                            />
                                            <label className="ml-2">{`${nombre} - ${cuotaParaPago.fechaPago[index]}`}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button onClick={() => setModalVisible(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Pagar</button>
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
