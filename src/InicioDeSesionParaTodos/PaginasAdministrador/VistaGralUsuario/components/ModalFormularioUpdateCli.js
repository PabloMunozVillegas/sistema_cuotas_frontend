import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { APIFunctions } from '../../../../axiosInstance';

const FormuUpdateClien = ({ onClose, clientId, updateClientData }) => {
    const [formData, setFormData] = useState({
        cedulaIdentidad: '',
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        direccion: '',
        genero: '',
        rol: ''
    });

    useEffect(() => {
        const fetchCliente = async () => {
            try {
              const token = localStorage.getItem('token');
              const enlace = `${clientId}`;
              const response = await APIFunctions.autenticacion.urlIdUnico(enlace, token); 
              const { cedulaIdentidad, nombres, apellidos, email, telefono, direccion, genero, rol } = response;
              setFormData({ cedulaIdentidad, nombres, apellidos, email, telefono, direccion, genero, rol });
            } catch (error) {
              console.error(error);
            }
          };
    
        fetchCliente();
    }, []); 
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    //Con token
    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        console.log(clientId)
        try {
            await APIFunctions.autenticacion.updateCliente( formData, clientId, token);
            updateClientData();
    
            toast.success('Cliente actualizado exitosamente', {
                position: "top-right",
                autoClose: 3000,
            });
            onClose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error('Error al actualizar cliente. Por favor, inténtelo de nuevo más tarde', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        }
    };
    
    const handleClickOutside = (event) => {
        if (event.target === event.currentTarget) {
            onClose(); // Cierra el modal solo si se hace clic fuera del contenido del modal
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30" onClick={handleClickOutside}>
            <div className="bg-white rounded-lg p-4 max-w-[80%] w-full md:max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-xl md:text-lg font-bold text-gray-700">Actualizar Cliente</h1>
                    
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="flex flex-col">
                            <label className="mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</label>
                            {key === 'genero' || key === 'rol' ? (
                                <select
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded w-full"
                                    required
                                >
                                    <option value="">Selecciona</option>
                                    {key === 'genero' ? (
                                        <>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Cliente">Cliente</option>
                                            <option value="Administrador">Administrador</option>
                                        </>
                                    )}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded w-full"
                                    required
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end col-span-2">
                        <button type="submit" className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Actualizar Cliente</button>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default FormuUpdateClien;
