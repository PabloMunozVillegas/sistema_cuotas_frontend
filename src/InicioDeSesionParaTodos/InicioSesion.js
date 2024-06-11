import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIFunctions } from '../axiosInstance';
import InputField from './InputField'; 
import ToastInstance from '../toastInstance';

const InicioSesion = () => {
    // Estado consolidado para los datos del formulario
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // Estado para el indicador de carga
    const [loading, setLoading] = useState(false);

    // Hook de navegación de react-router-dom
    const navigate = useNavigate();

    // Maneja el cambio en los inputs y actualiza el estado de los datos del formulario
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Maneja la presentación del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
      
        try {
            const response = await APIFunctions.autenticacion.login(formData);
            const token = response.token;
            if (token) {
                localStorage.setItem('token', token);
                if(response.data.rol === 'Administrador'){
                    navigate('/Inicio');
                } else {
                    ToastInstance({ type: 'success', message: 'Hola Usuario' });
                }
            } else {
                ToastInstance({ type: 'error', message: 'Problemas al iniciar sesión' });
            }
        } catch (error) {
            handleError(error); 
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar errores de forma centralizada
    const handleError = (error) => {
        if (error.response) {
            ToastInstance({ type: 'error', message: error.response.data.message });
        } else {
            console.error('Ocurrió un error al iniciar sesión:', error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <InputField
                        name="username"
                        value={formData.username}
                        placeholder="Usuario"
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        name="password"
                        value={formData.password}
                        placeholder="Contraseña"
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 rounded-lg text-white ${loading ? 'bg-lime-400' : 'bg-lime-500 hover:bg-lime-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500`}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
            <ToastInstance/>
        </div>
    );
};

export default InicioSesion;
