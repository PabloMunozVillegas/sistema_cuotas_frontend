import React, { useState } from 'react';

const ListaPago = () => {
    const [nombreCliente, setNombreCliente] = useState('Juan Perez'); 
    const [totalAPagar, setTotalAPagar] = useState(1200);
    const [cuotasPendientes, setCuotasPendientes] = useState(12); 
    const [montoCuotaPendiente, setMontoCuotaPendiente] = useState(100); 
    const [opcionPago, setOpcionPago] = useState('total');
    const [cuotasASeleccionar, setCuotasASeleccionar] = useState(1);

    const handleOpcionPagoChange = (event) => {
        setOpcionPago(event.target.value);
    };

    const handleCuotasChange = (event) => {
        setCuotasASeleccionar(Number(event.target.value));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const montoAPagar = opcionPago === 'total' 
            ? totalAPagar 
            : cuotasASeleccionar * montoCuotaPendiente;
        alert(`Monto a pagar: ${montoAPagar} bs`);
    };

    return (
        <div className="p-8 bg-white flex flex-col justify-center min-h-screen">
            <div className="w-full max-w-screen-lg mx-auto">
                <h1 className="text-4xl font-bold text-gray-700 mb-4">TOTAL A PAGAR</h1>
                <div className="text-center text-3xl font-bold mb-8">{totalAPagar} bs</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <p className="text-lg"><strong>Nombre Cliente:</strong> {nombreCliente}</p>
                        <p className="text-lg"><strong>Cuotas pendientes:</strong> {cuotasPendientes}</p>
                        <p className="text-lg"><strong>Monto cuota pendiente (más antigua):</strong> {montoCuotaPendiente} bs</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="radio"
                            id="total"
                            name="opcionPago"
                            value="total"
                            checked={opcionPago === 'total'}
                            onChange={handleOpcionPagoChange}
                            className="mr-2"
                        />
                        <label htmlFor="total" className="text-lg">Pagar deuda total ({totalAPagar} bs)</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="cuota"
                            name="opcionPago"
                            value="cuota"
                            checked={opcionPago === 'cuota'}
                            onChange={handleOpcionPagoChange}
                            className="mr-2"
                        />
                        <label htmlFor="cuota" className="text-lg">Cuota antigua a pagar</label>
                    </div>
                    {opcionPago === 'cuota' && (
                        <div className="mt-4">
                            <label htmlFor="cuotasASeleccionar" className="text-lg mr-2">Selecciona la cantidad de cuotas a pagar:</label>
                            <select 
                                id="cuotasASeleccionar" 
                                value={cuotasASeleccionar} 
                                onChange={handleCuotasChange} 
                                className="p-2 border border-gray-300 rounded"
                            >
                                {Array.from({ length: cuotasPendientes }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Generar QR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListaPago;