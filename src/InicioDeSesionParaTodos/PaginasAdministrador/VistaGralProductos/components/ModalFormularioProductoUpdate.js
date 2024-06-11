import React, { useState, useEffect } from 'react';
import { APIFunctions } from '../../../../axiosInstance';
import { toast , ToastContainer } from 'react-toastify';

const ModalFormularioUpdateProd = ({ productId, onClose }) => {
    const [formData, setFormData] = useState({
        nombreProducto: '',
        precio: '',
        descripcion: ''
    });

    useEffect(() => {
        fetchProductData();
    }, [productId]); // Se ejecuta cada vez que la productId cambia

    const fetchProductData = async () => {
        try {
            
            const token = localStorage.getItem('token');
            const enlace = `${productId}`;
            const response = await APIFunctions.producto.urlIdUnico(enlace, token);
            const productData = response;
            setFormData({
                nombreProducto: productData.nombreProducto,
                precio: productData.precio.toString(),
                descripcion: productData.descripcion
            });
        } catch (error) {
            console.error('Error al obtener los datos del producto:', error);
        }
    };

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
        
        // Ensure formData contains the correct properties
        const requestBody = {
            nombreProducto: formData.nombreProducto,
            precio: parseFloat(formData.precio),
            descripcion: formData.descripcion
        };
    
        try {
            const enlace = `${productId}`;
            
            // Logging to debug
            console.log('Request Body:', requestBody);
            console.log('Enlace:', enlace);
            console.log('Token:', token);
    
            // Ensure APIFunctions.producto.actualizar is a function
            if (typeof APIFunctions.producto.actualizar !== 'function') {
                throw new Error('APIFunctions.producto.actualizar is not a function');
            }
    
            // Await the API call and log the response
            const response = await APIFunctions.producto.actualizar(requestBody, enlace, token);
            console.log('Producto actualizado:', response);
    
            // Close the form
            onClose();
        } catch (error) {
            // Improved error handling
            console.error('Error al actualizar el producto:', error.message || error);
    
            // Optional: Show user-friendly error message (if using a notification library like react-toastify)
            toast.error('Error al actualizar el producto. Inténtelo de nuevo más tarde.', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-4 max-w-[80%] w-full md:max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className="text-xl md:text-lg font-bold text-gray-700">Actualizar Producto</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" method='post'>
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="flex flex-col">
                            <label className="mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="p-2 border border-gray-300 rounded w-full"
                                required
                            />
                        </div>
                    ))}
                    <div className="flex justify-end col-span-2">
                        <button type="submit" className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Confirmar Actualización</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ModalFormularioUpdateProd;
