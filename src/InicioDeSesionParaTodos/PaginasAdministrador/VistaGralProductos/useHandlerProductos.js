import { useState, useEffect } from 'react';
import { APIFunctions } from '../../../axiosInstance';

const useListaProductoHandlers = () => {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProductos = async () => {
        try {
            const enlace = `pagina=${currentPage}&limite=${limit}&buscar=${searchQuery}`;
            const token = localStorage.getItem('token');
            const response = await APIFunctions.producto.listarUrl(enlace, token);
            setProductos(response.productos);
            setTotalPages(response.paginas); // Cambio aquí para ajustar a la estructura correcta de tu API
        } catch (error) {
            console.error('Error al obtener la lista de productos:', error.message);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, [currentPage, searchQuery, limit]);

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

    const handleEditModal = async (productId) => {
        setCurrentProductId(productId);
        setShowUpdateModal(true);
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
        setCurrentPage(1); // Volver a la página 1 al cambiar la búsqueda
    };

    const handleOpenDeleteModal = (productId) => {
        setCurrentProductId(productId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteProduct = async () => {
        const token = localStorage.getItem('token');
        try {
            const enlace = `${currentProductId}`;
            await APIFunctions.producto.delete(enlace, token);
            handleCloseDeleteModal();
            fetchProductos();
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
        }
    };

    return {
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
    };
};

export default useListaProductoHandlers;
