import { Reserva } from './reserva';

export class Mesa {
    id:string;
    numero:number;
    nroComensales:number;//capacidad
    tipo:string;
    foto:string;
    estado:string;   
    reservas:Reserva[];

    constructor(){
        this.reservas = [];
    }
}
