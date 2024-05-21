import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Formulario = () => {
    const [formData, setFormData] = useState({
        Nombre: '',
        Contrasena: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await axios.post('http://localhost:3001/api/autenticacion/login', {
                username: formData.Nombre,
                password: formData.Contrasena
            });
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                navigate('/Inicio');
            } else {
                throw new Error('No se recibió un token después de iniciar sesión');
            }
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.message); 
            } else {
                console.error('Error al realizar la solicitud:', error.message);
            }
            setError('Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="Nombre"
                            value={formData.Nombre}
                            placeholder="Usuario"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            name="Contrasena"
                            value={formData.Contrasena}
                            placeholder="Contraseña"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 rounded-lg text-white ${loading ? 'bg-lime-400' : 'bg-lime-500 hover:bg-lime-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500`}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Formulario;
