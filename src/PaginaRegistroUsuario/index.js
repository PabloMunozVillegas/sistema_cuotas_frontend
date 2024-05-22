import React, { useState, useEffect } from 'react';
import Card from './components/Card'; // Asume que Card.js está en el mismo directorio

const ListaClientes = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/autenticacion/listar/clientes')
            .then(response => response.json())
            .then(data => setClientes(data.data)) // Mapear sobre data en lugar de clientes
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col">
            <h1 className="text-4xl font-bold text-gray-700 mb-8">Lista de Clientes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clientes.map((cliente, index) => (
                        <Card
                            key={index}
                            title={`${cliente.nombres} ${cliente.apellidos}`}
                            carnet={cliente.cedulaIdentidad}
                            nombre={cliente.username}
                            onMoreInfo={() => {
                            }}
                        />
                    ))}
                </div>
        </div>

    );
};


export default ListaClientes;