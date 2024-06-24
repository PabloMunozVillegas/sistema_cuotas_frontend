import React from 'react';
import useListaProductoHandlers from './useHandlerProductos';
import CardProducto from './components/CardProducto';
import FormuProducto from './components/ModalFormularioPro';
import ModalFormularioUpdateProd from './components/ModalFormularioProductoUpdate';

const ListaProducto = () => {
    const {
        productos,
        showModal,
        showUpdateModal,
        showDeleteModal,
        currentProductId,
        currentPage,
        totalPages,
        limit,
        searchQuery,
        handleOpenModal,
        handleCloseModal,
        handleCloseUpdateModal,
        handleEditModal,
        handleNextPage,
        handlePrevPage,
        handleSearchInputChange,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleDeleteProduct,
    } = useListaProductoHandlers();

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-700">Lista de Productos</h1>
                <button onClick={handleOpenModal} className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
                    Agregar Producto
                </button>
            </div>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Buscar por nombre o descripción..."
                    className="p-2 border border-gray-300 rounded-l w-full focus:outline-none"
                />
                <button onClick={handleSearchInputChange} className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-r focus:outline-none">
                    Buscar
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.map((producto, index) => (
                    <CardProducto
                        key={index}
                        title={producto.nombreProducto}
                        descripcion={producto.descripcion}
                        precio={producto.precio}
                        onEdit={() => handleEditModal(producto._id)}
                        onDelete={() => handleOpenDeleteModal(producto._id)}
                    />
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <button onClick={handlePrevPage} className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-l focus:outline-none" disabled={currentPage === 1}>
                    Anterior
                </button>
                <p className="bg-lime-300 text-white font-bold py-2 px-4">{currentPage}/{totalPages}</p>
                <button onClick={handleNextPage} className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-r focus:outline-none" disabled={currentPage === totalPages}>
                    Siguiente
                </button>
            </div>
            {showDeleteModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="text-lg font-bold mb-4">¿Estás seguro de que deseas eliminar este producto?</p>
                        <div className="flex justify-center">
                            <button onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4">
                                Confirmar
                            </button>
                            <button onClick={handleCloseDeleteModal} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <FormuProducto onClose={handleCloseModal} />
                </div>
            )}
            {showUpdateModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <ModalFormularioUpdateProd
                        onClose={handleCloseUpdateModal}
                        productId={currentProductId}
                    />
                </div>
            )}
        </div>
    );
};

export default ListaProducto;
