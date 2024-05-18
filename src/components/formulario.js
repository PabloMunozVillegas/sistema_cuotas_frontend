import React, { useState } from 'react';
import './fromulario.css';
import axios from 'axios';

const FormularioLogin = () => {
    const [formData, setFormData] = useState({
        Nombre: '',
        Contrasena: ''
    });
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3001/api/users', formData) 
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => { 
                console.error(error);
                setError('Error al enviar el formulario'); 
            });
    };

    return (
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Login</div>
            </div>
            <br />
            <form onSubmit={handleSubmit}>
                <div className={'inputContainer'}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Ingrese su email"
                        onChange={handleChange}
                        className={'inputBox'}
                    />
                </div>
                <br />
                <div className={'inputContainer'}>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Ingrese su contraseña"
                        onChange={handleChange}
                        className={'inputBox'}
                    />
                </div>
                <br />
                <button type="submit" className='rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default FormularioLogin;


