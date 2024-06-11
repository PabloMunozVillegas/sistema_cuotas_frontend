import React, { useState, useCallback } from 'react';
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

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);
    
    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleNextField(event);
        }
    }, []);

    const handleNextField = (event) => {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        const nextElement = form.elements[index + 1];
        if (nextElement) {
            nextElement.focus();
        } else {
            handleSubmit(event);
        }
    };

    const validateFormData = () => {
        if (!formData.cedulaIdentidad || !formData.nombres || !formData.apellidos || !formData.username || !formData.password || !formData.email || !formData.telefono || !formData.direccion || !formData.genero || !formData.rol) {
            ToastInstance({ type: 'error', message: 'Por favor, complete todos los campos obligatorios' });
            return false;
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

    const handleClickOutside = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const InputField = ({ name, type = "text", value, onChange, onKeyDown }) => (
        <div className="flex flex-col">
            <label className="mb-1 capitalize">{name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className="p-2 border border-gray-300 rounded w-full"
                required
            />
        </div>
    );

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30" onClick={handleClickOutside}>
            <div className="bg-white rounded-lg p-4 max-w-[80%] w-full md:max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-xl md:text-lg font-bold text-gray-700">Registro de Cliente</h1>
                    <DateTimeDisplay className="font-bold" />
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(formData).map((key) => {
                        if (key !== 'rol' && key !== 'genero') {
                            return (
                                <InputField
                                    key={key}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                />
                            );
                        }
                        return null; 
                    })}
                    <div className="flex flex-col">
                        <label className="mb-1 capitalize">Género</label>
                        <select
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="p-2 border border-gray-300 rounded w-full"
                            required
                        >
                            <option value="">Selecciona</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 capitalize">Rol</label>
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="p-2 border border-gray-300 rounded w-full"
                            required
                        >
                            <option value="">Selecciona</option>
                            <option value="Cliente">Cliente</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>

                    <div className="flex justify-end col-span-2">
                        <button type="submit" className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Confirmar Registro</button>
                    </div>
                </form>
                <ToastInstance/>
            </div>
        </div>
    );
};

export default FormuClien;
