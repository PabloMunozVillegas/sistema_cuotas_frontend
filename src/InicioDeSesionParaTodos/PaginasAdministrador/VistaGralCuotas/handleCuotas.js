import { useState, useEffect } from 'react';
import { APIFunctions } from '../../../axiosInstance';
import ToastInstance from '../../../toastInstance';
import { useNavigate } from 'react-router-dom';

const useCuotasForm = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        clientes: [],
        productos: [],
        formData: {
            clienteId: '',
            productoId: '',
            montoTotal: '',
            cantidadCuotas: '',
            fechaPago: new Date(Date.now()).toISOString().split('T')[0]
        },
        loading: true,
        error: null,
        modalOpen: false
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const [clientesResponse, productosResponse] = await Promise.all([
                    APIFunctions.autenticacion.listarUrl(null, token),
                    APIFunctions.producto.listarUrl(null, token)
                ]);
                setFormState(prevState => ({
                    ...prevState,
                    clientes: clientesResponse.data || [],
                    productos: productosResponse.productos || [],
                    loading: false
                }));
            } catch (error) {
                setFormState(prevState => ({
                    ...prevState,
                    error: 'Error al obtener la lista de clientes o productos',
                    loading: false
                }));
            }
        };

        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'productoId') {
            const selectedProduct = formState.productos.find(producto => producto._id === value);
            if (selectedProduct) {
                setFormState(prevState => ({
                    ...prevState,
                    formData: {
                        ...prevState.formData,
                        [name]: value,
                        montoTotal: selectedProduct.precio.toFixed(2)
                    }
                }));
            }
        } else {
            setFormState(prevState => ({
                ...prevState,
                formData: {
                    ...prevState.formData,
                    [name]: value
                }
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { clienteId, productoId, montoTotal, cantidadCuotas, fechaPago } = formState.formData;

        if (!clienteId || !productoId || !montoTotal || !cantidadCuotas || !fechaPago) {
            ToastInstance({ type: 'error', message: 'Por favor completa todos los campos.' });
            return;
        }

        if (parseInt(cantidadCuotas) > 24) {
            setFormState(prevState => ({
                ...prevState,
                modalOpen: true
            }));
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
        setFormState(prevState => ({
            ...prevState,
            modalOpen: false
        }));
        handleSubmit();
    };

    return { ...formState, handleChange, handleSubmit, handleModalConfirm };
};

export default useCuotasForm;
