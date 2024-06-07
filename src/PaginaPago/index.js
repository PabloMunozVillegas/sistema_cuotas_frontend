import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { APIFunctions } from '../axiosInstance';
import moment from 'moment';

const ListaPago = () => {
    const [cuotaParaPago, setCuotaParaPago] = useState(null);
    const [opcionPago, setOpcionPago] = useState('');
    const [cuotaSeleccionada, setCuotaSeleccionada] = useState('');
    const [totalAPagar, setTotalAPagar] = useState(0);
    const [selectedCuotaName, setSelectedCuotaName] = useState('');
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
                const total = cuotaParaPago.totalaApagar;
                setTotalAPagar(total);
                setSelectedCuotaName('');
            } else {
                const index = parseInt(cuotaSeleccionada);
                if (!isNaN(index) && index >= 0 && index < cuotaParaPago.montosPagar.length) {
                    setTotalAPagar(cuotaParaPago.montosPagar[index]);
                    setSelectedCuotaName(cuotaParaPago.nombreCuota[index]);
                } else {
                    setTotalAPagar(0);
                    setSelectedCuotaName('');
                }
            }
        }
    }, [opcionPago, cuotaParaPago, cuotaSeleccionada]);

    const handleOpcionPagoChange = (event) => {
        setOpcionPago(event.target.value);
        setCuotaSeleccionada('');
        setTotalAPagar(0);
        setSelectedCuotaName('');
    };

    const handleCuotaSeleccionadaChange = (event) => {
        setCuotaSeleccionada(event.target.value);
    };

    const handleModalConfirm = () => {
        registrarPago();
        setModalVisible(false);
    };

    const registrarPago = async () => {
        try {
            const token = localStorage.getItem('token');
            let cuotasPagar = [];

            if (opcionPago === 'total') {
                cuotasPagar = [cuotaParaPago.cuotasPendientes];
            } else {
                cuotasPagar = [cuotaParaPago.cuotasPendientes[cuotaSeleccionada]];
            }

            const response = await APIFunctions.pagos.create({
                idPago: cuotasPagar
            }, cuotaParaPago.idUsuario, token);

            if (response) {
                toast.success('Pago registrado con éxito');
                navigate('/Inicio/VistaDePago');
            } else {
                toast.error('Error al registrar el pago');
            }
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
                                <label className="block font-semibold mb-2">
                                    Cuota Seleccionada
                                </label>
                                <div className="flex flex-col">
                                    <select onChange={handleCuotaSeleccionadaChange} value={cuotaSeleccionada}>
                                        <option value="">Seleccionar Cuota</option>
                                        {cuotaParaPago && cuotaParaPago.nombreCuota && cuotaParaPago.nombreCuota.map((nombre, index) => (
                                            <option key={index} value={index}>{`${nombre} - ${moment(cuotaParaPago.fechaPago[index]).format('YYYY/MM/DD')}`}</option>
                                        ))}
                                    </select>
                                    <p className="mt-2">Nombre de la Cuota: {selectedCuotaName}</p>
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
