// useCuotasForm.js
import { useState, useEffect } from 'react';
import { APIFunctions } from '../../../axiosInstance';
import ToastInstance from '../../../toastInstance';
import { useNavigate } from 'react-router-dom';

const useCuotasForm = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState({
        clienteId: '',
        productoId: '',
        montoTotal: null,
        cantidadCuotas: '',
        fechaPago: new Date(Date.now()).toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // Aquí definimos setModalOpen

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const clientesResponse = await APIFunctions.autenticacion.listarUrl(null, token);
                const productosResponse = await APIFunctions.producto.listarUrl(null, token);
                setClientes(clientesResponse.data || []);
                setProductos(productosResponse.productos || []);
            } catch (error) {
                setError('Error al obtener la lista de clientes o productos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'productoId') {
            const selectedProduct = productos.find(producto => producto._id === value);
            if (selectedProduct) {
                setFormData(prevData => ({
                    ...prevData,
                    [name]: value,
                    montoTotal: selectedProduct.precio.toFixed(2)
                }));
            }
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { clienteId, productoId, montoTotal, cantidadCuotas, fechaPago } = formData;

        if (!clienteId || !productoId || !montoTotal || !cantidadCuotas || !fechaPago) {
            ToastInstance({ type: 'error', message: 'Por favor completa todos los campos.' });
            return;
        }

        if (parseInt(cantidadCuotas) > 24 ) {
            setModalOpen(true); 
            return;
        }

        const data = {
            producto: productoId,
            usuario: clienteId,
            montoTotal: parseFloat(montoTotal),
            cantidadCuotas: parseInt(cantidadCuotas),
            fechaDePago: fechaPago
        };

        try {
            const token = localStorage.getItem('token');
            const enlace = `${clienteId}/${productoId}`;
            const response = await APIFunctions.cuotas.create(data, enlace, token);
            if (response === 201) {
                ToastInstance({ type: 'success', message: 'Cuota registrada' });
                setTimeout(() => {
                    navigate('/Inicio/VistaDeClientes');
                }, 2000);
            } else {
                ToastInstance({ type: 'error', message: 'Error al registrar la cuota' });
            }
        } catch (error) {
            console.error(error);   
            ToastInstance({ type: 'error', message: 'Error al registrar la cuota' });
        }  
    };

    const handleModalConfirm = () => {
        setModalOpen(false);
        handleSubmit();
    };

    return { clientes, productos, formData, loading, error, modalOpen, handleChange, handleSubmit, handleModalConfirm, setModalOpen };
};

export default useCuotasForm;
