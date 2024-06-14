import React, { useState, useEffect } from 'react';
import { APIFunctions } from '../../axiosInstance';
import CardCuota from './components/CardCuotaCli'; // Asegúrate de importar el componente CardCuota
import { useNavigate } from 'react-router-dom';

const ListaCuotas = () => {
    const [cuotas, setCuotas] = useState([]);
    const [cliente, setCliente] = useState(null);
    const navigate = useNavigate();

    const fetchCuotasPorCliente = async () => {
        const id = localStorage.getItem('idCliente');
        const token = localStorage.getItem('token');
        const enlace = `${id}`;
        
        try {
            const response = await APIFunctions.autenticacion.urlIdUnico(enlace, token);
            const perfil = {
                nombres: response.nombres,
                apellidos: response.apellidos,
                cedulaIdentidad: response.cedulaIdentidad,
                username: response.username,
                telefono: response.telefono,
                email: response.email,
                direccion: response.direccion,
                genero: response.genero,
            };
            setCliente(perfil);

            const responseDos = await APIFunctions.cuotas.urlIdUnico(enlace, token);
            const cuotasConProductos = responseDos.cuotas.map(cuota => ({
                ...cuota,
                producto: cuota.producto.map(producto => producto)
            }));
            setCuotas(cuotasConProductos);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchCuotasPorCliente();
    }, []);

    const handleMoreInfo = (cuotaId) => {
        navigate(`/Pendientes/MasDetalle/${cuotaId}`);
    };

    return (
        <div>
            {cuotas.map(cuota => (
                <CardCuota 
                    key={cuota._id}
                    cuota={cuota}
                    onMoreInfo={handleMoreInfo}
                />
            ))}
        </div>
    );
};

export default ListaCuotas;
