import { Reserva, EstadoReserva } from './reserva';
import { Estados } from './enums/estados';

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


    /**
     * Verifica si la mesa tiene o no reserva
     * @param mesa la mesa con sus reservas
     * @returns true si tiene reserva y está dentro del tiempo,
     * false si no tiene reserva o si excedió el tiempo de reserva
     */
    static verificarReserva(mesa:Mesa):boolean{
        
        let mesaReservada= false;
              
        for(let reserva of mesa.reservas) {
            if(Reserva.verificarHorarioReserva(reserva)) {        
                mesaReservada=true;
                break;
            }
        }
        return mesaReservada;
    }
}
