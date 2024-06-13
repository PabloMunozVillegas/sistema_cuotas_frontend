// useListaPago.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastInstance from '../../../toastInstance';
import { APIFunctions } from '../../../axiosInstance';

const useListaPago = () => {
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
                ToastInstance({ type: 'error', message: 'No se seleccionaron cuotas' });
                return;
            }

            const enlace = cuotaParaPago.cuotaSeleccionadaId;
            const data = cuotasPagar;
            await APIFunctions.pagos.create(data, enlace, token);
            ToastInstance({ type: 'success', message: 'Pago realizado con éxito!' });
            navigateToVistaDePago();
        } catch (error) {
            ToastInstance({ type: 'error', message: 'Error al registrar el pago' });
        }
    };

    return {
        cuotaParaPago,
        opcionPago,
        totalAPagar,
        cuotasSeleccionadas,
        modalVisible,
        handleOpcionPagoChange,
        handleCuotaSeleccionadaChange,
        handleModalConfirm,
        setModalVisible
    };
};

export default useListaPago;
