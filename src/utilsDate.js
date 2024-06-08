// utils.js
export const obtenerNombreMes = (numeroMes) => {
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return nombresMeses[numeroMes - 1]; // Restamos 1 porque los meses en JS empiezan en 0
};
