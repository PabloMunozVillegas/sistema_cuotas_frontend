import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardProducto from './components/CardProducto';
import FormuProducto from '../components/ModalFormularioPro';

const ListaProducto = () => {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10); // Número de productos por página
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProductos();
    }, [currentPage, searchQuery]); // Llama a fetchProductos cada vez que currentPage o searchQuery cambia

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
    }, []); // Se ejecuta solo una vez al inicio para establecer el límite inicial

    const fetchProductos = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:3001/api/productos/listar?pagina=${currentPage}&limite=${limit}&buscar=${searchQuery}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductos(response.data.productos);
            setTotalPages(response.data.totalPaginas);
        } catch (error) {
            console.error('Error al obtener la lista de productos:', error.message);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        fetchProductos(); // Actualiza la lista de productos después de cerrar el modal
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

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-700">Lista de Productos</h1>
                <button onClick={handleOpenModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
                <button onClick={fetchProductos} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none">
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
                    />
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <button onClick={handlePrevPage} className="bg-lime-300 hover:bg-lime-400 text-white font-bold py-2 px-4 rounded-l focus:outline-none" disabled={currentPage === 1}>
                    Anterior
                </button>
                <p className="bg-lime-300 text-white font-bold py-2 px-4">{currentPage}/{totalPages}</p>
                <button onClick={handleNextPage} className="bg-lime-300 hover:bg-lime-400 text-white font-bold py-2 px-4 rounded-r focus:outline-none" disabled={currentPage === totalPages}>
                    Siguiente
                </button>
            </div>
            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-md w-96">
                        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <FormuProducto onClose={handleCloseModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListaProducto;
