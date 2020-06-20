export enum  Estados {
    // cliente
    pendienteDeAprobacion = 'pendienteAprobacion', 
    sinAtender = 'sinAtender',
    enEspera = 'enEspera', //en lista de espera
    puedeTomarMesa = 'puedeTomarMesa',
    atendido = 'atendido', //comiendo
    pagando = 'pagando', //comiendo
    mesaAsignada = 'mesaAsignada',
    esperandoOrden = 'esperandoOrden', //ya hizo su pedido
    finalizado = 'finalizado', // ya pago
    tieneReserva = 'tieneReserva',
    // mesa  
    disponible = 'disponible',
    ocupada = 'ocupada',
    reservada = 'reservada',

     // mozo - bartender - cocinero 
     pedidoAceptado = 'pedidoAceptado',
     pedidoTerminado = 'pedidoTerminado',

      // pedido
      entregado = 'pedidoAceptado',
      enPreparacion = 'pedidoTerminado',
    
}
