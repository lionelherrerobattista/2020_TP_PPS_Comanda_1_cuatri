import { Pedido } from './pedido';

export class Usuario {
        id: string;
        email: string;
        password: string;
        perfil: string;   
        nombre:string;
        apellido:string;
        foto:string;
        dni:number;
        cuil:number;
        estado:string;
        token?:string;
    }