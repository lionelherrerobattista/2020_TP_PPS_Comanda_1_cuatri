import { Usuario } from './usuario';
import { Mesa } from './mesa';
import { Pedido } from './pedido';
import { Consulta } from './consulta';

export class Cliente extends Usuario {
    
    mesa?:Mesa;
    pedido?:Pedido;
    consulta?:Consulta[];
}
