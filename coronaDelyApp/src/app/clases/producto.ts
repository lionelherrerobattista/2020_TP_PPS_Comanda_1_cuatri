export enum TipoProducto {
    comida,
    bebida,
    postre,
}

export class Producto {
    id:string;
    nombre:string;
    descripcion:string;
    tiempoPreparacion:number;
    precio:number;
    fotos:string[];
    sector:string;
    tipo:TipoProducto;
    estado?:string;
    cantidad?:number;
}
