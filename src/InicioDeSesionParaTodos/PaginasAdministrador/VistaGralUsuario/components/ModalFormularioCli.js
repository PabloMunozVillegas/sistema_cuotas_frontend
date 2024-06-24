import React, { useState } from 'react';
import DateTimeDisplay from '../../../../components/FechaHora';
import ToastInstance from '../../../../toastInstance';
import { APIFunctions } from '../../../../axiosInstance';

const fields = [
    { name: 'cedulaIdentidad', label: 'Cédula de Identidad', type: 'text', pattern: '[a-zA-Z0-9\s]', required: true },
    { name: 'nombres', label: 'Nombres', type: 'text', pattern: '[a-zA-Z\s]', required: true },
    { name: 'apellidos', label: 'Apellidos', type: 'text', pattern: '[a-zA-Z\s]', required: true },
    { name: 'username', label: 'Nombre de Usuario', type: 'text', pattern: null, required: true },
    { name: 'password', label: 'Contraseña', type: 'password', pattern: null, required: true },
    { name: 'email', label: 'Correo Electrónico', type: 'email', pattern: '^\S+@\S+\.\S+$', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'text', pattern: '[\d-]', required: true },
    { name: 'direccion', label: 'Dirección', type: 'text', pattern: '[a-zA-Z0-9\s,.#-]', required: true },
    { name: 'genero', label: 'Género', type: 'select', options: ['', 'Masculino', 'Femenino'], pattern: null, required: true },
    { name: 'rol', label: 'Rol', type: 'select', options: ['', 'Cliente', 'Administrador'], pattern: null, required: true },
];

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
                filteredValue = value.replace(/[^\d-]/g, '');
                break;
            case 'cedulaIdentidad':
                filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
                break;
            case 'nombres':
            case 'apellidos':
                filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
                break;
            case 'email':
                if (new RegExp(fields.find(field => field.name === 'email').pattern).test(value)) {
                    filteredValue = value;
                } else {
                    filteredValue = '';
                }
                break;
            case 'direccion':
                filteredValue = value.replace(/[^a-zA-Z0-9\s,.#-]/g, '');
                break;
            default:
                filteredValue = value;
                break;
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: filteredValue,
        }));
    };

    const validateFormData = () => {
        const requiredFields = fields.filter(field => field.required).map(field => field.name);

        for (const field of requiredFields) {
            if (!formData[field]) {
                ToastInstance({ type: 'error', message: 'Por favor, complete todos los campos obligatorios' });
                return false;
            }
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(formData.email)) {
            ToastInstance({ type: 'error', message: 'El correo electrónico ingresado no es válido' });
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateFormData()) return;

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

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-4 max-w-[80%] w-full md:max-w-md relative overflow-y-auto max-h-[90%]">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {fields.map(field => (
                        <div key={field.name} className="flex flex-col mb-4">
                            <label className="mb-1 capitalize">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded w-full"
                                    required={field.required}
                                >
                                    {field.options.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded w-full"
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button type="submit" className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Confirmar Registro</button>
                    </div>
                </form>
                <ToastInstance />
            </div>
        </div>
    );
};

export default FormuClien;
