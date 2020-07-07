import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from 'src/app/clases/pedido';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.scss'],
})
export class PedidoDetalleComponent implements OnInit {

  @Input()pedido:Pedido;
  total:number;
  
  constructor() { 
    this.total = 0;
  }

  ngOnInit() {
    for(let auxProducto of this.pedido.productos) {

      this.total += (auxProducto.precio * auxProducto.cantidad);

    }
  }

}
