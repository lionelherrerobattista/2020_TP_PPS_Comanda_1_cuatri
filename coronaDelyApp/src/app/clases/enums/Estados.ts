export enum  Estados {
    // cliente
    pendienteDeAprobacion = 'pendienteAprobacion', 
    sinAtender = 'sinAtender',
    enEspera = 'enEspera',
    puedeTomarMesa = 'puedeTomarMesa',
    atendido = 'atendido',
    esperandoOrden = 'esperandoOrden',
    finalizado = 'finalizado',
    // mesa  
    disponible = 'disponible',
    ocupada = 'ocupada',
    reservada = 'reservada'
}
