// useFormHandlers.js
import { useState } from 'react';
import { APIFunctions } from '../../../../axiosInstance';
import ToastInstance from '../../../../toastInstance';

const useFormHandlers = ({ onClose }) => {
    const [formData, setFormData] = useState({
        nombreProducto: '',
        precio: '',
        descripcion: ''
    });

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
            await APIFunctions.producto.create(requestBody, null, token);
            ToastInstance({ type: 'success', message: 'Producto registrado exitosamente' });
            onClose();
        } catch (error) {
            ToastInstance({ type: 'error', message: 'Error al registrar producto. Inténtelo de nuevo más tarde.' });
        }
    };

    return { formData, handleChange, handleSubmit };
};

export default useFormHandlers;
