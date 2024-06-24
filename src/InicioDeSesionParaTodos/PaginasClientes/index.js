import React, { useState, useEffect } from 'react';
import { APIFunctions } from '../../axiosInstance';
import CardCuota from './components/CardCuotaCli'; // Asegúrate de importar el componente CardCuota
import { useNavigate } from 'react-router-dom';

const ListaCuotas = () => {
    const [cuotas, setCuotas] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCuotasYCliente = async () => {
            try {
                const idCliente = localStorage.getItem('idCliente');
                const token = localStorage.getItem('token');

                // Obtener datos del cliente
                const responseCliente = await APIFunctions.autenticacion.urlIdUnico(idCliente, token);
                const perfilCliente = {
                    nombres: responseCliente.nombres,
                    apellidos: responseCliente.apellidos,
                    cedulaIdentidad: responseCliente.cedulaIdentidad,
                    username: responseCliente.username,
                    telefono: responseCliente.telefono,
                    email: responseCliente.email,
                    direccion: responseCliente.direccion,
                    genero: responseCliente.genero,
                };
                setCliente(perfilCliente);

                // Obtener cuotas del cliente con sus productos y pagos
                const responseCuotas = await APIFunctions.cuotas.urlIdUnico(idCliente, token);
                const cuotasConProductos = await Promise.all(responseCuotas.cuotas.map(async cuota => {
                    const responsePagos = await APIFunctions.pagos.urlIdUnico(cuota._id, token);
                    return {
                        ...cuota,
                        producto: cuota.producto,
                        pagos: responsePagos // Incluir los pagos en la estructura de cuota
                    };
                }));
                setCuotas(cuotasConProductos);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCuotasYCliente();
    }, []);

    // Función para mostrar el modal con la información detallada del cliente
    const openModal = () => {
        setShowModal(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Función para obtener la imagen de avatar según el género del cliente
    const getAvatarImage = () => {
        if (cliente && cliente.genero) {
            return cliente.genero === 'Masculino' ? '/hombreAvatar.webp' : '/mujerAvatar.webp';
        }
        // Si no se ha cargado el cliente o no se tiene género definido, retornar una imagen genérica
        return '/hombreAvatar.webp'; // Puedes cambiar esto por una imagen genérica neutra si es necesario
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center">Menu de Cuotas Pendientes</h1>
                {cliente && (
                    <div className="mb-8 p-4 bg-white shadow rounded-lg">
                        <div className="flex items-center mb-4">
                            {/* Mostrar foto del cliente con avatar por defecto */}
                            <img 
                                src={process.env.PUBLIC_URL + getAvatarImage()} 
                                alt="Avatar Cliente" 
                                className="w-20 h-20 rounded-full cursor-pointer"
                                onClick={openModal}
                            />
                            <div className="ml-4">
                                <h2 className="text-2xl font-semibold">{cliente.nombres} {cliente.apellidos}</h2>
                                <p><strong>Cédula de Identidad:</strong> {cliente.cedulaIdentidad}</p>
                                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                            </div>
                        </div>
                        <p><strong>Email:</strong> {cliente.email}</p>
                        <p><strong>Dirección:</strong> {cliente.direccion}</p>
                    </div>
                )}
                <div className="mb-6">
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
                        onClick={() => navigate('/nueva-cuota')}
                    >
                        Añadir Nueva Cuota
                    </button>
                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        onClick={() => navigate('/historial-cuotas')}
                    >
                        Ver Historial de Cuotas
                    </button>
                </div>
                {cuotas.length > 0 ? (
                    cuotas.map(cuota => (
                        <CardCuota 
                            key={cuota._id}
                            cuota={cuota}
                            pagos={cuota.pagos} // Pasar los pagos directamente
                            navigate={navigate}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No hay cuotas pendientes.</p>
                )}

                {/* Modal para mostrar la información detallada del cliente */}
                {cliente && (
                    <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center ${showModal ? '' : 'hidden'}`}>
                        <div className="bg-white p-8 rounded-lg max-w-md">
                            <h2 className="text-2xl font-bold mb-4">Información Detallada del Cliente</h2>
                            <p><strong>Nombre:</strong> {cliente.nombres} {cliente.apellidos}</p>
                            <p><strong>Cédula de Identidad:</strong> {cliente.cedulaIdentidad}</p>
                            <p><strong>Username:</strong> {cliente.username}</p>
                            <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                            <p><strong>Email:</strong> {cliente.email}</p>
                            <p><strong>Dirección:</strong> {cliente.direccion}</p>
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                                onClick={closeModal}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListaCuotas;
