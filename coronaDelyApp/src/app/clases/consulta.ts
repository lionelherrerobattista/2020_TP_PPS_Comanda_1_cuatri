
export enum EstadoConsulta {
    respondida = "respondida",
    leida = "leída",
    enviada = "enviada",
}

export class Consulta {
    id:string;
    idMesa:string;
    textoConsulta:string;
    respuesta:string;
    estado:string;

    constructor() {
        this.textoConsulta = '';
        this.respuesta = '';
        this.estado = EstadoConsulta.enviada;
    }

}
