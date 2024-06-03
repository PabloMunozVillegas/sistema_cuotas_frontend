import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalEliminar from '../components/ModalEliminar';
import FormuUpdateClien from '../components/ModalFormularioUpdateCli';
import FormuClien from '../components/ModalFormularioCli';
import Card from './components/Card';
import { APIFunctions } from '../axiosInstance';

const ListaClientes = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        fetchClientes();
    }, [currentPage, searchQuery, limit]);

    const fetchClientes = async () => {
        const formData = {
            pagina: currentPage,
            limite: limit,
            buscar: searchQuery,
        }
        
        try {
            const token = localStorage.getItem('token');
            console.log("Token:", token);
            await APIFunctions.autenticacion.getClientes(null, token); // Corrección aquí
           
        } catch (error) {
            console.error(error);
        }
    };
    
    

    const handleOpenModalInfo = (cliente) => {
        navigate('/Inicio/VistaInfo', { state: { clienteId: cliente._id } });
    };
    

    const handleOpenModalAddClient = () => {
        setShowModal(true);
        setModalType('add');
    };
    

    const handleOpenModal = (clientId) => {
        setSelectedClientId(clientId);
        setShowModal(true);
        setModalType('update');
    };

    const handleEliminarCliente = async (clientId) => {
        setSelectedClientId(clientId);
        setShowModal(true);
        setModalType('delete');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType('');
        fetchClientes(); 
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
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

    const updateClientData = async () => {
        try {
            await fetchClientes();
        } catch (error) {
            console.error(error);
        }
    };

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

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-700">Lista de Clientes</h1>
                <button onClick={handleOpenModalAddClient} className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
                    Agregar Cliente
                </button>

            </div>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Buscar por nombre o CI..."
                    className="p-2 border border-gray-300 rounded-l w-full focus:outline-none"
                />
                <button onClick={fetchClientes} className="bg-lime-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-r focus:outline-none">
                    Buscar
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientes.map((cliente, index) => (
                    <Card
                        key={index}
                        title={`${cliente.nombres} ${cliente.apellidos}`}
                        carnet={cliente.cedulaIdentidad}
                        nombre={cliente.username}
                        onMoreInfo={() => {}}
                        onAdd={() =>  handleOpenModalInfo(cliente)}
                        onEdit={() => handleOpenModal(cliente._id)}
                        onDelete={() => handleEliminarCliente(cliente._id)}
                    />
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <button onClick={handlePrevPage} className="bg-lime-500 hover:bg-l-400 text-white font-bold py-2 px-4 rounded-l focus:outline-none" disabled={currentPage === 1}>
                    Anterior
                </button>
                <p className="bg-lime-300 text-white font-bold py-2 px-4">{currentPage}/{totalPages}</p>
                <button onClick={handleNextPage} className="bg-lime-300 hover:bg-lime-400 text-white font-bold py-2 px-4 rounded-r focus:outline-none" disabled={currentPage === totalPages}>
                    Siguiente
                </button>
            </div>

            {/* Modal para agregar cliente */}
            {showModal && modalType === 'add' && (
                <FormuClien onClose={handleCloseModal} />
            )}

            
            {/* Modal para editar cliente */}
            {showModal && modalType === 'update' && (
                <FormuUpdateClien
                    clientId={selectedClientId}
                    onClose={handleCloseModal}
                    updateClientData={updateClientData}
                />
            )}

            {/* Modal para eliminar cliente */}
            {showModal && modalType === 'delete' && (
                <ModalEliminar clientId={selectedClientId} onClose={handleCloseModal} updateClientData={updateClientData} />
            )}
        </div>
    );
};

export default ListaClientes;
