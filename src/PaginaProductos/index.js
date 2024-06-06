import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardProducto from './components/CardProducto';
import FormuProducto from '../components/ModalFormularioPro';
import ModalFormularioUpdateProd from '../components/ModalFormularioProductoUpdate';
import { APIFunctions } from '../axiosInstance';

const ListaProducto = () => {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para mostrar el modal de confirmación
    const [currentProductId, setCurrentProductId] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null); 

    useEffect(() => {
        fetchProductos();
    }, [currentPage, searchQuery]);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 576) {
                setLimit(2);
            } else if (screenWidth >= 576 && screenWidth < 768) {
                setLimit(4);
            } else if (screenWidth >= 768 && screenWidth < 992) {
                setLimit(6);
            } else if (screenWidth >= 992 && screenWidth < 1200) {
                setLimit(8);
            } else {
                setLimit(10);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchProductos = async () => {
        try {
           
            const enlace = `pagina=${currentPage}&limite=${limit}&buscar=${searchQuery}`;
            const token = localStorage.getItem('token');
            const response = await APIFunctions.producto.listarUrl(enlace, token);
            setProductos(response.productos);
            setTotalPages(response.totalPaginas);
        } catch (error) {
            console.error('Error al obtener la lista de productos:', error.message);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        fetchProductos();
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        fetchProductos();
    };

    const handleEditModal = (productId) => {
        setCurrentProductId(productId);
        setShowUpdateModal(true);
        getProduct(productId);
    };

    const getProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:3001/api/productos/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSelectedProduct(response.data);
        } catch (error) {
            console.error('Error al obtener el producto:', error.message);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Función para abrir el modal de confirmación
    const handleOpenDeleteModal = (productId) => {
        setCurrentProductId(productId);
        setShowDeleteModal(true);
    };

    // Función para cerrar el modal de confirmación
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    // Función para eliminar el producto
    const handleDeleteProduct = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3001/api/productos/${currentProductId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            handleCloseDeleteModal(); // Cierra el modal de confirmación
            fetchProductos(); // Actualiza la lista de productos después de la eliminación
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
        }
    };

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
                <button onClick={fetchProductos} className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-r focus:outline-none">
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
                        onDelete={() => handleOpenDeleteModal(producto._id)} // Llama a la función para abrir el modal de confirmación
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
            {/* Modal de confirmación para eliminar el producto */}
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
            {/* Otros modales */}
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
                        selectedProduct={selectedProduct}
                    />
                </div>
            )}
        </div>
    );
};

export default ListaProducto;
