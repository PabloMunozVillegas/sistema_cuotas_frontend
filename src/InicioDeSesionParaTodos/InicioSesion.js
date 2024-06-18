import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSubmitLogin, handleChangeLogin } from './handlersInicioDeSesion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import InputField from './InputField'; 
import ToastInstance from '../toastInstance';

const InicioSesion = ({ setToken }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        await handleSubmitLogin(formData, setLoading, setToken, navigate);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Iniciar Sesión</h2>
                <form onSubmit={handleFormSubmit}>
                    <InputField
                        name="username"
                        value={formData.username}
                        placeholder="Usuario"
                        onChange={(event) => handleChangeLogin(event, formData, setFormData)}
                        required
                    />
                    <div className="mb-4 relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            placeholder="Contraseña"
                            onChange={(event) => handleChangeLogin(event, formData, setFormData)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                        </button>
                    </div>
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
