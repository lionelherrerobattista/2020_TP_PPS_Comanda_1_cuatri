import { Mesa } from './mesa';
import { Cliente } from './cliente';

export enum EstadoReserva {
    aConfirmar = "a confirmar",
    confirmada = "confirmada",
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
