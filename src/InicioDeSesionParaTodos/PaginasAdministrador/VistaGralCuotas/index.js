import React from 'react';
import ToastInstance from '../../../toastInstance';
import useCuotasForm from './handleCuotas';
import Loader from '../../../components/Loader';

const FormuCuotas = () => {
    const {
        clientes,
        productos,
        formData,
        loading,
        error,
        modalOpen,
        handleChange,
        handleSubmit,
        handleModalConfirm,
        setModalOpen
    } = useCuotasForm();

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-black">{error}</div>;
    }

    return (
        <div className="p-8 bg-white flex flex-col justify-center min-h-screen text-black">
            <div className="w-full max-w-screen-lg mx-auto">
                <h1 className="flex justify-between items-center mb-4">Registrar Cuotas</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Cliente</label>
                        <select
                            value={formData.clienteId}
                            onChange={handleChange}
                            name="clienteId"
                            className="border p-2 rounded w-full"
                            required
                        >
                            <option value="">Seleccionar Cliente</option>
                            {clientes.map(cliente => (
                                <option key={cliente._id} value={cliente._id}>{`${cliente.nombres} - ${cliente.cedulaIdentidad}`}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Producto</label>
                        <select
                            value={formData.productoId}
                            onChange={handleChange}
                            name="productoId"
                            className="border p-2 rounded w-full"
                            required
                        >
                            <option value="">Seleccionar Producto</option>
                            {productos.map(producto => (
                                <option key={producto._id} value={producto._id}>{producto.nombreProducto}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Monto Total (Bs)</label>
                        <input
                            type="number"
                            name="montoTotal"
                            value={formData.montoTotal || ''}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Cantidad de Cuotas</label>
                        <input
                            type="number"
                            name="cantidadCuotas"
                            value={formData.cantidadCuotas}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Fecha de Pago</label>
                        <input
                            type="date"
                            name="fechaPago"
                            value={formData.fechaPago}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="bg-lime-500 hover:bg-gray-500 text-white px-4 py-2 rounded">
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <p>La cantidad de cuotas o el monto total excede los límites. ¿Desea continuar?</p>
                        <div className="mt-4">
                            <button onClick={() => setModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 mr-2 rounded">
                                Cancelar
                            </button>
                            <button onClick={handleModalConfirm} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded">
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastInstance/>
        </div>
    );
};

export default FormuCuotas;

