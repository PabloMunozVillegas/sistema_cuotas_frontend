// VistaGeneral.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const VistaGeneral = () => {
    const location = useLocation();
    const clienteId = location.state && location.state.clienteId;
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [cuotas, setCuotas] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productos, setProductos] = useState({});
    const [pagosPorProducto, setPagosPorProducto] = useState({});

    useEffect(() => {
        const fetchCliente = async () => {
            if (clienteId) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:3001/api/autenticacion/cliente/${clienteId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setCliente(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error al obtener los datos del cliente:', error);
                    setLoading(false);
                }
            }
        };
        fetchCliente();
    }, [clienteId]);

    useEffect(() => {
        const fetchCuotas = async () => {
            if (clienteId) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:3001/api/cuotas/usuario/${clienteId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setCuotas(response.data);
                } catch (error) {
                    console.error('Error al obtener las cuotas del usuario:', error);
                }
            }
        };

        const fetchPagos = async () => {
            if (clienteId) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:3001/api/pagos/listar/${clienteId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setPagos(response.data);
                } catch (error) {
                    console.error('Error al obtener los pagos del cliente:', error);
                }
            }
        };

        fetchCuotas();
        fetchPagos();
    }, [clienteId]);

    useEffect(() => {
        const fetchProducto = async (idProducto) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/api/productos/${idProducto}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProductos(prevProductos => ({
                    ...prevProductos,
                    [idProducto]: response.data.nombreProducto
                }));
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };
        cuotas.forEach(cuota => {
            fetchProducto(cuota.producto);
        });
    }, [cuotas]);

    useEffect(() => {
        const contarPagosPorProducto = () => {
            const pagosPorProductoContador = {};
            cuotas.forEach(cuota => {
                const producto = productos[cuota.producto];
                if (!pagosPorProductoContador[producto]) {
                    pagosPorProductoContador[producto] = { pendientes: 0, pagados: 0 };
                }
                const pagosPendientes = pagos.filter(pago => pago.cuotas === cuota._id && pago.estadoPago === "Pendiente").length;
                const pagosPagados = pagos.filter(pago => pago.cuotas === cuota._id && pago.estadoPago === "Pagado").length;
                pagosPorProductoContador[producto].pendientes += pagosPendientes;
                pagosPorProductoContador[producto].pagados += pagosPagados;
            });
            setPagosPorProducto(pagosPorProductoContador);
        };
        contarPagosPorProducto();
    }, [cuotas, pagos, productos]);

    const handlePagoClick = (cuota) => {
        const nombreCliente = `${cliente.nombres} ${cliente.apellidos}`;
        const pagosDeCuota = pagos.filter(pago => pago.cuotas === cuota._id && pago.estadoPago === "Pendiente");
        const pagosIds = pagosDeCuota.map(pago => pago._id);
        const montosAPagar = pagosDeCuota.map(pago => pago.totalPagado);
        const datosPago = {
            idUsuario: clienteId,
            nombreUsuario: nombreCliente,
            idPagos: pagosIds,
            montosPagar: montosAPagar,
        };
        localStorage.setItem('datosPago', JSON.stringify(datosPago));
        navigate('/Inicio/VistaDePago', { state: { clienteId } });
    };

    return (
        <div className="p-8 bg-white shadow-md rounded-lg">
            {cliente ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block font-semibold">Carnet de Identidad</label>
                            <p className="border p-2 rounded">{cliente.cedulaIdentidad}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Nombre</label>
                            <p className="border p-2 rounded">{cliente.nombres}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Apellidos</label>
                            <p className="border p-2 rounded">{cliente.apellidos}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Email</label>
                            <p className="border p-2 rounded">{cliente.email}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Celular</label>
                            <p className="border p-2 rounded">{cliente.telefono}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Dirección</label>
                            <p className="border p-2 rounded">{cliente.direccion}</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Cuotas del Cliente</h2>
                        {loading ? (
                            <p>Cargando cuotas...</p>
                        ) : (
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2">Nombre del Producto</th>
                                        <th className="py-2">Fecha de Pago</th>
                                        <th className="py-2">Monto a Pagar por mes</th>
                                        <th className="py-2">Cuotas Pendientes</th>
                                        <th className="py-2">Cuotas Pagados</th>
                                        <th className="py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuotas.map(cuota => (
                                        <tr key={cuota._id} className="text-center">
                                            <td className="py-2 border">{productos[cuota.producto]}</td>
                                            <td className="py-2 border">{moment.utc(cuota.fechaDePago).format('YYYY/MM/DD')}</td>
                                            <td className="py-2 border">{cuota.montoPagar}</td>
                                            <td className="py-2 border">{pagosPorProducto[productos[cuota.producto]]?.pendientes || 0}</td>
                                            <td className="py-2 border">{pagosPorProducto[productos[cuota.producto]]?.pagados || 0}</td>
                                            <td className="py-2 border">
                                                {cuota.estadoCouta === "Completado" ? (
                                                    <span>Pago Completado</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePagoClick(cuota)}
                                                        className="bg-lime-500 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                                    >
                                                        Ir a Pago
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            ) : (
                <p>Selecciona un cliente para ver su información.</p>
            )}
        </div>
    );
};

export default VistaGeneral;
