import { Producto } from './producto';
import { Estados } from './enums/estados';
import { ProductoService } from '../servicios/producto.service';

export class Pedido {
    id?: string;
    productos:Producto[];
    idMesa:string;
    idCliente:string;
    precioTotal?:number;
    estado?:Estados;

    constructor(productos:Producto[], idCliente:string, idMesa:string) {
        
        productos.map(producto => {
            producto.estado = Estados.enPreparacion;
        });

        this.productos = productos;
        this.precioTotal = Pedido.calcularPrecioTotal(productos);
        this.idCliente = idCliente;
        this.idMesa = idMesa;

    }


    ///Calula el precio total del listado de productos que recibe
    static calcularPrecioTotal(productos:Producto[]):number {
        let total = 0;

        for(let auxProducto of productos) {
            total += (auxProducto.precio * auxProducto.cantidad);
        }

        return total;
    }
}
