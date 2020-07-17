import { Mesa } from './mesa';
import { Cliente } from './cliente';

export enum EstadoReserva {
    aConfirmar = "a confirmar",
    confirmada = "confirmada",
    utilizada = "utilizada", //cuando el cliente se sienta en la mesa
    cancelada = "cancelada",
}

export class Reserva {
    fecha: any;
    cantidadComensales: number;
    cliente: Cliente;
    mesa:Mesa;
    id?:string;
    estado:EstadoReserva;

    constructor(){
        this.estado = EstadoReserva.aConfirmar;
    }

}
