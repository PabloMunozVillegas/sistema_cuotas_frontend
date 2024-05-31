import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

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
    const [modalOpen, setModalOpen] = useState(false); // Estado para controlar si el modal está abierto

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const [clientesResponse, productosResponse] = await Promise.all([
                    axios.get('http://localhost:3001/api/autenticacion/listar/clientes', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    axios.get('http://localhost:3001/api/productos/listar', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);
                setClientes(clientesResponse.data.data || []);
                setProductos(productosResponse.data.productos || []);
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
                    montoTotal: selectedProduct.precio.toFixed(2) // Convert price to fixed decimal
                }));
            }
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { clienteId, productoId, montoTotal, cantidadCuotas, fechaPago } = formData;

        // Validations
        if (!clienteId || !productoId || !montoTotal || !cantidadCuotas || !fechaPago) {
            toast.error('Por favor completa todos los campos.');
            return;
        }

        if (parseInt(cantidadCuotas) > 24 ) {
            setModalOpen(true); // Abre el modal si se exceden los límites
            return;
        }

        const data = {
            producto: productoId,
            usuario: clienteId,
            montoTotal: parseFloat(montoTotal),
            cantidadCuotas: parseInt(cantidadCuotas),
            fechaDePago: fechaPago
        };
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:3001/api/cuotas/create/${clienteId}/${productoId}`, 
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                console.log(response);
                toast.success('Cuota registrada');
                setTimeout(() => {
                    navigate('/Inicio/VistaDeClientes');
                }, 2000);

            })
            .catch(error => {
                toast.error('No se pudo registrar la cuota');
            });
    };

    const handleModalConfirm = () => {
        setModalOpen(false);
        handleSubmit(); // Envía el formulario cuando se confirma en el modal
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
                <h1 className="text-4xl font-bold text-gray-700 mb-4">Registrar Cuotas</h1>
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
                            disabled // Bloquea el campo de monto total
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
            {/* Modal de confirmación */}
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
            <ToastContainer />
        </div>
    );
};

export default FormuCuotas;
