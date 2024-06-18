// useModalFormHandlers.js
import { useState, useEffect } from 'react';
import { APIFunctions } from '../../../../axiosInstance';
import ToastInstance from '../../../../toastInstance';

const useModalFormHandlers = ({ productId, onClose }) => {
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
            ToastInstance({ type: 'error', message: 'Error al obtener los datos del producto' });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'precio') {
            // Permitir solo números y punto decimal
            if (!/^\d*\.?\d*$/.test(value)) {
                return;
            }
        }

         // Ajustar altura automáticamente
         event.target.style.height = 'auto';
         event.target.style.height = event.target.scrollHeight + 'px';
         
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        
        const requestBody = {
            nombreProducto: formData.nombreProducto,
            precio: parseFloat(formData.precio),
            descripcion: formData.descripcion
        };
    
        try {
            const enlace = `${productId}`;
            const response = await APIFunctions.producto.actualizar(requestBody, enlace, token);
            ToastInstance({ type: 'success', message: 'Producto actualizado exitosamente' });
    
            onClose();
        } catch (error) {
            console.error('Error al actualizar el producto:', error.message || error);
            ToastInstance({ type: 'error', message: 'Error al actualizar el producto' });
        }
    };

    return { formData, handleChange, handleSubmit };
};

export default useModalFormHandlers;
