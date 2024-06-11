import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { APIFunctions } from '../../../axiosInstance';

const FormuCuotas = () => {
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
    const [modalOpen, setModalOpen] = useState(false);

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
                console.error('Error al obtener la lista de clientes o productos:', error);
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
            toast.error('Por favor completa todos los campos.');
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
                toast.success('Cuota registrada');
                setTimeout(() => {
                    navigate('/Inicio/VistaDeClientes');
                }, 2000);
            } else {
                toast.error('Error al registrar la cuota');
            }
        } catch (error) {
            console.error(error);   
            toast.error('Error al registrar la cuota');
        }  
    };

    const handleModalConfirm = () => {
        setModalOpen(false);
        handleSubmit();
    };

    if (loading) {
        return <div className="text-black">Cargando...</div>;
    }

    if (error) {
        return <div className="text-black">{error}</div>;
    }

    return (
        <div className="p-8 bg-white flex flex-col justify-center min-h-screen text-black">
            <div className="w-full max-w-screen-lg mx-auto">
                <h1 className="flex justify-between items-center mb-4">Registrar Cuotas</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Cliente</label>
                        <select
                            value={formData.clienteId}
                            onChange={handleChange}
                            name="clienteId"
                            className="border p-2 rounded w-full"
                            required
                        >
                            <option value="">Seleccionar Cliente</option>
                            {clientes.map(cliente => (
                                <option key={cliente._id} value={cliente._id}>{cliente.nombres}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Producto</label>
                        <select
                            value={formData.productoId}
                            onChange={handleChange}
                            name="productoId"
                            className="border p-2 rounded w-full"
                            required
                        >
                            <option value="">Seleccionar Producto</option>
                            {productos.map(producto => (
                                <option key={producto._id} value={producto._id}>{producto.nombreProducto}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Monto Total (Bs)</label>
                        <input
                            type="number"
                            name="montoTotal"
                            value={formData.montoTotal || ''}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Cantidad de Cuotas</label>
                        <input
                            type="number"
                            name="cantidadCuotas"
                            value={formData.cantidadCuotas}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Fecha de Pago</label>
                        <input
                            type="date"
                            name="fechaPago"
                            value={formData.fechaPago}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="bg-lime-500 hover:bg-gray-500 text-white px-4 py-2 rounded">
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <p>La cantidad de cuotas o el monto total excede los límites. ¿Desea continuar?</p>
                        <div className="mt-4">
                            <button onClick={() => setModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 mr-2 rounded">
                                Cancelar
                            </button>
                            <button onClick={handleModalConfirm} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded">
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </div>
    );
};

export default FormuCuotas;
