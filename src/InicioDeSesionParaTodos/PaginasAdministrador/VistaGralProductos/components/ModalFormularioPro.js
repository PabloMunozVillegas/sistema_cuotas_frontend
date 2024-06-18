// FormuProducto.js
import React from 'react';
import useFormHandlers from './handlerProd';

const FormuProducto = ({ onClose }) => {
    const { formData, handleChange, handleSubmit } = useFormHandlers({ onClose });

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-4 max-w-[80%] w-full md:max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className="text-xl md:text-lg font-bold text-gray-700">Registro de Producto</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" method='post'>
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="flex flex-col">
                            <label className="mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</label>
                            {key === 'descripcion' ? (
                                <textarea
                                    name={key}
                                    value={formData[key]}
                                    onChange={(e) => {
                                        handleChange(e);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    className="p-2 border border-gray-300 rounded w-full"
                                    required
                                    style={{ resize: 'none', minHeight: '40px', maxHeight: '200px', overflowY: 'auto' }}
                                />
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
                        <button type="submit" className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Confirmar Registro</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormuProducto;
