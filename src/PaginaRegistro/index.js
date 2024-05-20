   
import React, { useState } from 'react';
import axios from 'axios';

const FormularioLogin = () => {
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
    const [error, setError] = useState('');

    const { cedulaIdentidad, nombres, apellidos, username, password, email, telefono, direccion, genero, rol } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <div>
            <form onSubmit={handleSubmit} method="post" className="flex flex-col items-center justify-center">
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Carnet de Identidad
                    </span>
                    <input type="text" name="cedulaIdentidad" value={cedulaIdentidad} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese su Carnet de Identidad" />
                </label>
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Nombre
                    </span>
                    <input type="text" name="nombres" value={nombres} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese su Nombre" />
                </label>
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Apellido
                    </span>
                    <input type="text" name="apellidos" value={apellidos} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese su Apellido" />
                </label>
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Usuario
                    </span>
                    <input type="text" name="username" value={username} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese su Usuario" />
                </label>
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Contraseña
                    </span>
                    <input type="password" name="password" value={password} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese su Contraseña" />
                </label>
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Correo Electrónico
                    </span>
                    <input type="email" name="email" value={email} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese su Correo Electrónico" />
                </label>
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Nro de Telefono
                    </span>
                    <input type="text" name="telefono" value={telefono} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese su Número de Teléfono" />
                </label>
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Dirección
                    </span>
                    <input type="text" name="direccion" value={direccion} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese su Dirección" />
                </label>
                {/*Aqui  se debe hacer un wrap para seleccionar el rol y genero*/}
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Sexo
                    </span>
                    <select name="genero" value={genero} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1">
                        <option value="">Seleccionar</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </label>
                <label className="block">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                        Rol
                    </span>
                    <select name="rol" value={rol} onChange={handleChange} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1">
                        <option value="">Seleccionar</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Cliente">Cliente</option>
                    </select>
                </label>
                {/*Fin aqui*/}
                <button type="submit" className='rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                    Registrarse
                </button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default FormularioLogin;
