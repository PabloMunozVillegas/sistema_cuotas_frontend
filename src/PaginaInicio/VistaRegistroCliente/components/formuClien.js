import React, { useState } from 'react';
import axios from 'axios';
import RegisterButton from './boton';
import DateTimeDisplay from '../../../components/FechaHora'; 
import { toast, ToastContainer } from 'react-toastify';

const FormuClien = () => {
    const [formData, setFormData] = useState({
        cedulaIdentidad: '',
        nombres: '',
        apellidos: '',
        username: '',
        password: '',
        email: '',
        telefono: '',
        direccion: '',
        genero: '',
        rol: 'Cliente'
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const response = await axios.post(
                'http://localhost:3001/api/autenticacion/create', 
                formData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success('Usuario registrado exitosamente',{
                position: "top-right",
                autoClose: 3000,
            });
            // Aquí podrías redirigir al usuario a donde desees después de registrar el cliente
        } catch (error) {
            console.error('Error al registrar cliente:', error.message);
            // Aquí podrías manejar el error de alguna manera (por ejemplo, mostrando un mensaje al usuario)
        }
    };

    return (
        <div className="p-8 bg-white flex flex-col justify-center min-h-screen">
            <div className="w-full max-w-screen-lg mx-auto flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-gray-700">Registro de Cliente</h1>
                <DateTimeDisplay />
            </div>
            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="mb-2 capitalize">Cédula de Identidad</label>
                    <input
                        type="text"
                        name="cedulaIdentidad"
                        value={formData.cedulaIdentidad}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 capitalize">Nombres</label>
                    <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 capitalize">Apellidos</label>
                    <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 capitalize">Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 capitalize">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 capitalize">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 capitalize">Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 capitalize">Dirección</label>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 capitalize">Género</label>
                    <select
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="">Selecciona</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>
                <ToastContainer />
                <div className="col-span-2 flex justify-end mt-4">
                    <RegisterButton onClick={handleSubmit} />
                </div>
            </form>
        </div>
    );
};

export default FormuClien;
