import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
