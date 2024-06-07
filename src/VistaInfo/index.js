import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { APIFunctions } from '../axiosInstance';

const VistaGeneral = () => {
    const location = useLocation();
    const clienteId = location.state && location.state.clienteId;
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [cuotas, setCuotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productos, setProductos] = useState({});
    const [pagos, setPagos] = useState([]);
    const [pagosLoaded, setPagosLoaded] = useState(false);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await APIFunctions.autenticacion.urlIdUnico(clienteId, token);
                setCliente(response);
            } catch (error) {
                console.error('Error al obtener los datos del cliente:', error);
            }
        };
        fetchCliente();
    }, [clienteId]);

    useEffect(() => {
        const fetchCuotas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await APIFunctions.cuotas.urlIdUnico(clienteId, token);
                setCuotas(response.cuotas || []);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener las cuotas del usuario:', error);
                setLoading(false);
            }
        };
        fetchCuotas();
    }, [clienteId]);

    useEffect(() => {
        const fetchProducto = async (idProducto) => {
            try {
                const token = localStorage.getItem('token');
                const response = await APIFunctions.producto.urlIdUnico(idProducto, token);
                setProductos(prevProductos => ({
                    ...prevProductos,
                    [idProducto]: response
                }));
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        const uniqueProductIds = [...new Set(cuotas.map(cuota => cuota.producto))];
        uniqueProductIds.forEach(fetchProducto);
    }, [cuotas]);

    useEffect(() => {
        const fetchPagos = async () => {
            if (cuotas.length > 0 && !pagosLoaded && cliente) {
                try {
                    const token = localStorage.getItem('token');
                    const cuotaIds = cuotas.map(cuota => cuota._id);
                    const promesasPagos = cuotaIds.map(async cuotaId => {
                        const response = await APIFunctions.pagos.urlIdUnicoCliente(cuotaId, token);
                        return response;
                    });
                    const resultadosPagos = await Promise.all(promesasPagos);

                    setPagos(resultadosPagos);
                    setPagosLoaded(true);
                } catch (error) {
                    console.error('Error al obtener los pagos del cliente:', error);
                    setLoading(false);
                }
            }
        };
        fetchPagos();
    }, [cuotas, pagosLoaded, cliente]);

    const handlePagoClick = (cuota) => {
        if (!cliente) {
            console.error('No se ha seleccionado un cliente.');
            return;
        }
    
        const cuotaPago = pagos?.find(pago => pago.pagos.find(p => p.cuotas === cuota._id));
        const nombreCliente = `${cliente.nombres} ${cliente.apellidos}`;
        const nombreCuota = cuotaPago.pagos.map(pago => pago.numeroDeCuota);
        const totalApagar = cuotaPago ? cuotaPago.totalApagar : 0;
        const pagosDeCuota = cuotaPago.pagos.map(pago => pago.totalPagado);
        
        // Format fechaPago here
        const fechaPago = cuotaPago.pagos.map(pago => moment.utc(pago.fechaPago).format('YYYY/MM/DD'));
    
        const datosPago = {
            idUsuario: clienteId,
            nombreUsuario: nombreCliente,
            nombreCuota: nombreCuota,
            totalaApagar: totalApagar,
            montosPagar: pagosDeCuota,
            fechaPago: fechaPago
        };
        localStorage.setItem('datosPago', JSON.stringify(datosPago));
        setPagos(prevPagos => [...prevPagos, datosPago]);
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
                                        <th className="py-2">Estado de Cuota</th>
                                        <th className="py-2">Cuotas pendientes</th>
                                        <th className="py-2">Cuotas pagadas</th>
                                        <th className="py-2">Monto pagos por mes</th>
                                        <th className="py-2">Monto a Pagar total</th>
                                        <th className="py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(cuotas) && cuotas.length > 0 ? (
                                    cuotas.map((cuota) => {
                                        const cuotaPago = pagos?.find(pago => pago.pagos.find(p => p.cuotas === cuota._id));
                                        const cuotasPendientes = cuotaPago ? cuotaPago.cuotasPendientes : 0;
                                        const cuotasPagadas = cuotaPago ? cuotaPago.cuotasPagadas : 0;
                                        const pagosPagados = cuotaPago ? cuotaPago.pagosPagados : 0;
                                        const totalApagar = cuotaPago ? cuotaPago.totalApagar : 0;

                                        return (
                                            <tr key={cuota._id} className="text-center">
                                                <td className="py-2 border">{productos[cuota.producto]?.nombreProducto || 'Nombre no disponible'}</td>
                                                <td className="py-2 border">{moment.utc(cuota.fechaDePago).format('YYYY/MM/DD')}</td>
                                                <td className="py-2 border">{cuota.estadoCouta === "Completado" ? "Pago Completado" : "Pendiente"}</td>
                                                <td className="py-2 border">{cuotasPendientes}</td>
                                                <td className="py-2 border">{cuotasPagadas}</td>
                                                <td className="py-2 border">{pagosPagados}</td>
                                                <td className="py-2 border">{totalApagar}</td>
                                                <td className="py-2 border">
                                                    <button
                                                        onClick={() => handlePagoClick(cuota)}
                                                        disabled={cuota.estadoCouta === "Completado"}
                                                        className="bg-lime-500 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                                    >
                                                        Ir a Pago
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-2 border text-center">No hay cuotas disponibles.</td>
                                    </tr>
                                )}

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
