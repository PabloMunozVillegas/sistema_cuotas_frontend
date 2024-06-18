import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import { APIFunctions } from '../../../../axiosInstance';
import { obtenerNombreMes } from '../../../../utilsDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

moment.locale('es');

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

        const uniqueProductIds = [...new Set(cuotas.map(cuota => cuota.producto[0]._id))];
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

        const nombreCuota = cuotaPago.pagos
            .filter(pago => pago.estadoPago === 'Pendiente')
            .map(pago => pago.numeroDeCuota);

        const totalApagar = cuotaPago ? cuotaPago.totalApagar : 0;
        const pagosDeCuota = cuotaPago.pagos.filter(pago => pago.estadoPago === 'Pendiente').map(pago => pago.totalPagado);

        const fechaPagoArray = cuotaPago.pagos.filter(pago => pago.estadoPago === 'Pendiente').map(pago => {
            const dia = moment.utc(pago.fechaPago).format('DD');
            const mes = moment.utc(pago.fechaPago).format('MM');
            const anio = moment.utc(pago.fechaPago).format('YYYY');
            const nombreMes = obtenerNombreMes(parseInt(mes, 10));
            return `${dia} de ${nombreMes} del ${anio}`;
        });
        const idPagos = cuotaPago.pagos.filter(pago => pago.estadoPago === 'Pendiente').map(pago => pago._id);
        const cuotaSeleccionadaId = cuota._id; // Agregar el ID de la cuota seleccionada

        const datosPago = {
            idUsuario: clienteId,
            nombreUsuario: nombreCliente,
            nombreCuota: nombreCuota,
            totalaApagar: totalApagar,
            montosPagar: pagosDeCuota,
            fechaPago: fechaPagoArray,
            pagosId: idPagos,
            cuotaSeleccionadaId: cuotaSeleccionadaId // Incluir el ID de la cuota seleccionada
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
                            <p className="border-2 p-2 border-gray-500 rounded">{cliente.cedulaIdentidad}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Nombre</label>
                            <p className="border-2 p-2 border-gray-500 rounded">{cliente.nombres}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Apellidos</label>
                            <p className="border-2 p-2 border-gray-500 rounded">{cliente.apellidos}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Email</label>
                            <p className="border-2 p-2 border-gray-500 rounded">{cliente.email}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Celular</label>
                            <p className="border-2 p-2 border-gray-500 rounded">{cliente.telefono}</p>
                        </div>
                        <div>
                            <label className="block font-semibold">Dirección</label>
                            <p className="border-2 p-2 border-gray-500 rounded">{cliente.direccion}</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Cuotas del Cliente</h2>
                        {loading ? (
                            <p>Cargando cuotas...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="border-2 border-gray-500 py-2 px-4 bg-lime-300">Nombre del Producto</th>
                                            <th className="border-2 border-gray-500 py-2 px-4 bg-lime-300">Precio del Producto</th>
                                            <th className="border-2 border-gray-500 py-2 px-4 bg-lime-300">Fecha de Pago</th>
                                            <th className="border-2 border-gray-500 py-2 px-4 bg-lime-300">Cuotas pendientes</th>
                                            <th className="border-2 border-gray-500 py-2 px-4 bg-lime-300">Cuotas pagadas</th>
                                            <th className="border-2 border-gray-500 py-2 px-4 bg-lime-300">Monto pagos por mes</th>
                                            <th className="border-2 border-gray-500 py-2 px-4 bg-lime-300">Saldo Total</th>
                                            <th className="border-2 border-gray-500 py-2 px-4 bg-lime-300">Acciones</th>
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
                                                const producto = productos[cuota.producto[0]._id] || {};
                                                const nombreProducto = producto.nombreProducto || 'Nombre no disponible';
                                                const precioProducto = producto.precio || 'Precio no disponible';
                                                const estadoCuota = cuota.estadoCouta === "Completado" ? "Pago Completado" : "Pendiente";

                                                return (
                                                    <tr key={cuota._id} className="text-center">
                                                        <td className="border-2 border-gray-500 py-2 px-4">{nombreProducto}</td>
                                                        <td className="border-2 border-gray-500 py-2 px-4">{precioProducto}</td>
                                                        <td className="border-2 border-gray-500 py-2 px-4">{moment.utc(cuota.fechaDePago).format('YYYY/MM/DD')}</td>
                                                        <td className="border-2 border-gray-500 py-2 px-4">{cuotasPendientes}</td>
                                                        <td className="border-2 border-gray-500 py-2 px-4">{cuotasPagadas}</td>
                                                        <td className="border-2 border-gray-500 py-2 px-4">{pagosPagados}</td>
                                                        <td className="border-2 border-gray-500 py-2 px-4">{totalApagar}</td>
                                                        <td className="border-2 border-gray-500 py-2 px-4">
                                                            {estadoCuota === "Pendiente" && (
                                                                <button
                                                                    onClick={() => handlePagoClick(cuota)}
                                                                    className="text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                                                >
                                                                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Pagar
                                                                </button>
                                                            )}
                                                            {estadoCuota === "Pago Completado" && (
                                                                <span className="text-green-500">
                                                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Pagado
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-4 border-2">No se encontraron cuotas para este cliente.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <svg
                        aria-hidden="true"
                        className="w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2917 88.1812 35.879C89.083 38.2083 91.5423 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default VistaGeneral;
