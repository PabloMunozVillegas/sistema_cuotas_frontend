import React from 'react';

const RegisterButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 bg-lime-500 text-white font-bold rounded hover:bg-lime-700"
        >
            Registrar
        </button>
    );
};

export default RegisterButton;
