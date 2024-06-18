import React, { useState, useEffect } from 'react';
import { APIFunctions } from '../../axiosInstance';
import CardCuota from './components/CardCuotaCli'; // Asegúrate de importar el componente CardCuota
import { useNavigate } from 'react-router-dom';

const ListaCuotas = () => {
    const [cuotas, setCuotas] = useState([]);
    const [cliente, setCliente] = useState(null);
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

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6">Lista de Cuotas</h1>
                {cliente && (
                    <div>
                        <p><strong>Cliente:</strong> {cliente.nombres} {cliente.apellidos}</p>
                        <p><strong>Cédula de Identidad:</strong> {cliente.cedulaIdentidad}</p>
                        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                    </div>
                )}
                {cuotas.map(cuota => (
                    <CardCuota 
                        key={cuota._id}
                        cuota={cuota}
                        pagos={cuota.pagos} // Pasar los pagos directamente
                        navigate={navigate}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListaCuotas;
