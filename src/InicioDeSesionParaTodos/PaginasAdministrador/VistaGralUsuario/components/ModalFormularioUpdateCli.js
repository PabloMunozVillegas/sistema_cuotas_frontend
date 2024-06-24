import React, { useState } from 'react';
import DateTimeDisplay from '../../../../components/FechaHora'; 
import ToastInstance from '../../../../toastInstance';
import { APIFunctions } from '../../../../axiosInstance';

const FormuClien = ({ onClose }) => {
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
        rol: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        let filteredValue = value;

        switch (name) {
            case 'telefono':
                // Filtrar solo dígitos y guiones
                filteredValue = value.replace(/[^\d-]/g, '');
                break;
            case 'cedulaIdentidad':
                // Permitir letras solo para carnets internacionales
                filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
                break;
            case 'nombres':
            case 'apellidos':
                // Filtrar solo letras y espacios
                filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
                break;
            case 'email':
                // Validar formato de correo electrónico
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    filteredValue = value;
                } else {
                    filteredValue = '';
                }
                break;
            case 'direccion':
                // Filtrar letras, números, espacios y algunos signos de puntuación
                filteredValue = value.replace(/[^a-zA-Z0-9\s,.#-]/g, '');
                break;
            default:
                // Para campos que no necesitan filtro específico
                filteredValue = value;
                break;
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: filteredValue,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await APIFunctions.autenticacion.create(formData, null, token); 
            ToastInstance({ type: 'success', message: 'Usuario registrado exitosamente' });
            setTimeout(onClose, 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al registrar cliente. Por favor, inténtelo de nuevo más tarde';
            ToastInstance({ type: 'error', message: errorMessage });
        }
    };

    const InputField = ({ name, type = "text", value }) => (
        <div className="flex flex-col mb-4">
            <label className="mb-1 capitalize">{name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
                required
            />
        </div>
    );

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-4 max-w-[80%] w-full md:max-w-md relative overflow-y-auto max-h-[90%]">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl md:text-lg font-bold text-gray-700">Registro de Cliente</h1>
                    <DateTimeDisplay className="font-bold" />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {Object.keys(formData).map((key) => (
                        <InputField
                            key={key}
                            name={key}
                            value={formData[key]}
                        />
                    ))}
                    <div className="flex flex-col mb-4">
                        <label className="mb-1 capitalize">Género</label>
                        <select
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded w-full"
                            required
                        >
                            <option value="">Selecciona</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-1 capitalize">Rol</label>
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded w-full"
                            required
                        >
                            <option value="">Selecciona</option>
                            <option value="Cliente">Cliente</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Confirmar Registro</button>
                    </div>
                </form>
                <ToastInstance/>
            </div>
        </div>
    );
};

export default FormuClien;
