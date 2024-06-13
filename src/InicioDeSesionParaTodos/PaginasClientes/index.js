import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardCuota from './components/CardCuotaCli';

const ListaCuotas = () => {
    const [clientes, setClientes] = useState([]);
    const [cuotas, setCuotas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Clientes y cuotas predefinidos para demostración
        const predefinidosClientes = [
            { id: '1', nombre: 'Juan', apellidos: 'Perez', email: 'juan@example.com', telefono: '123456789' },
            { id: '2', nombre: 'Maria', apellidos: 'Lopez', email: 'maria@example.com', telefono: '987654321' },
            { id: '3', nombre: 'Carlos', apellidos: 'Martinez', email: 'carlos@example.com', telefono: '456789012' },
        ];
        const predefinidosCuotas = [
            { id: '1', clienteId: '1', producto: 'Celular', montoTotal: 1200, cuotasTotales: 12, cuotasPagadas: 6 },
            { id: '2', clienteId: '1', producto: 'Laptop', montoTotal: 2500, cuotasTotales: 10, cuotasPagadas: 4 },
            { id: '3', clienteId: '1', producto: 'Lentes', montoTotal: 800, cuotasTotales: 8, cuotasPagadas: 3 },
            { id: '4', clienteId: '1', producto: 'Reloj', montoTotal: 1000, cuotasTotales: 10, cuotasPagadas: 5 },
        ];
        setClientes(predefinidosClientes);
        setCuotas(predefinidosCuotas);
    }, []);

    const handleMoreInfo = (cuotaId) => {
        navigate(`/detalle-cuota/${cuotaId}`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCuotas = cuotas.filter(cuota =>
        cuota.producto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col">
            <h1 className="text-4xl font-bold text-gray-700 mb-8">Historial de Cuotas</h1>
            <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-4 p-2 border rounded w-full"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCuotas.map((cuota) => {
                    const cliente = clientes.find(c => c.id === cuota.clienteId);
                    return (
                        <CardCuota 
                            key={cuota.id}
                            cuota={cuota}
                            cliente={cliente}
                            onMoreInfo={handleMoreInfo}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ListaCuotas;