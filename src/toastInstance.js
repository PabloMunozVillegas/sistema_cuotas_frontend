import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * @param {string} type 
 * @param {string} message 
 */


const ToastInstance = ({ type, message }) => {
    const options = {
        position: "top-right",
        autoClose: 3000
    };

    if (type === 'success') {
        toast.success(message, options);
    } else if (type === 'error') {
        toast.error(message, options);
    }

    return (
        <ToastContainer />
    );
};

export default ToastInstance;
