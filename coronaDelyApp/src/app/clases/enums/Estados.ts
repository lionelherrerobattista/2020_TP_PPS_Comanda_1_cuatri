export enum  Estados {
    // cliente
    pendienteDeAprobacion = 'pendienteAprobacion', //el dueño/supervisor todavía no aprobó el registro
    aprobado = 'aprobado', //el dueño/supervisor aprobó el registro
    sinAtender = 'sinAtender',
    enEspera = 'enEspera', //en lista de espera
    puedeTomarMesa = 'puedeTomarMesa',
    atendido = 'atendido', //comiendo
    pagando = 'pagando', //comiendo
    mesaAsignada = 'mesaAsignada',
    esperandoOrden = 'esperandoOrden', //ya hizo su pedido
    finalizado = 'finalizado', // ya pago
    tieneReserva = 'tieneReserva',
    rechazado = 'rechazado', //lo hace el metre o el supervisor/dueño
    
    // mesa  
    disponible = 'disponible',
    ocupada = 'ocupada',
    reservada = 'reservada',

    // mozo - bartender - cocinero 
    pedidoAceptado = 'pedidoAceptado',
    pedidoTerminado = 'pedidoTerminado',

    // pedido
    entregado = 'entregado', //se lo da al cliente y espera que lo acepte
    listoParaEntregar = 'listo para entregar',
    enPreparacion = 'en preparacion',
    aceptadoPorCliente = 'aceptado por cliente',
    confirmarPago= 'confirmar pago',
    abonado = 'abonado',
    
}
