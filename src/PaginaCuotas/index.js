import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormuCuotas = () => {
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState({
        clienteId: '',
        productoId: '',
        montoTotal: null, // Change initial value to null
        cantidadCuotas: '',
        fechaPago: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [clientesResponse, productosResponse] = await Promise.all([
                    axios.get('http://localhost:3001/api/autenticacion/listar/clientes'),
                    axios.get('http://localhost:3001/api/productos/listar')
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
        console.log(`Seleccionado ${name}: ${value}`);
        
        if (name === 'productoId') {
            const selectedProduct = productos.find(producto => producto._id === value);
            if (selectedProduct) {
                setFormData(prevData => ({
                    ...prevData,
                    [name]: value,
                    montoTotal: selectedProduct.precio.toString()
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
                console.log('Cuota registrada:', response.data);
            })
            .catch(error => {
                console.error('Error registrando cuota:', error);
            });
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
                        <label className="block font-semibold mb-2">Monto Total</label>
                        <input
                            type="number"
                            name="montoTotal"
                            value={formData.montoTotal || ''} // Ensure montoTotal is either a string or an empty string
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
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
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormuCuotas;
