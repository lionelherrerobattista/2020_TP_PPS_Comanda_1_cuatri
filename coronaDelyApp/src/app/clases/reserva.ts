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

    /**
     * Verifica si la reserva está dentro del horario
     * @param reserva la reserva que se quiere verificar
     * @returns true si está dentro del horario,
     * si excedió el horario de la reserva
     */
    static verificarHorarioReserva(reserva:Reserva):boolean{
        let limiteMinReserva= reserva.fecha.seconds - 2400; //40 minutos antes
        let limiteMaxReserva= reserva.fecha.seconds + 2400; //40 minutos despues
        let enHorario= false;
        let horaActual = Math.round(new Date().getTime()/1000) //en SEGUNDOS Unix para comparar con firebase
              
        if(reserva.estado == EstadoReserva.confirmada &&
            (horaActual >= limiteMinReserva && horaActual <= limiteMaxReserva)) { 
            
            enHorario=true;
        }

        console.log("En horario: " + enHorario);
        
        return enHorario;
    }

    /**
     * Verifica si se superó el tiempo máximo de la reserva
     * @param reserva Reserva del cliente
     * @returns true si se excedió, de lo contrario, false
     */
    static verificarReservaVencida(reserva:Reserva):boolean {
        let vencioReserva = false;
        let horaActual = Math.round(new Date().getTime()/1000) //en SEGUNDOS Unix para comparar con firebase
        let limiteMaxReserva= reserva.fecha.seconds + 2400; //40 minutos despues

        if(reserva.estado == EstadoReserva.confirmada &&
           horaActual > limiteMaxReserva) { 
            
            vencioReserva=true;
        }

        return vencioReserva;
    }

}
