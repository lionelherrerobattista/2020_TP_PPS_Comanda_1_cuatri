import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { Producto } from 'src/app/clases/producto';
import { Pedido } from 'src/app/clases/pedido';

@Component({
  selector: 'app-modal-menu-detalle',
  templateUrl: './modal-menu-detalle.page.html',
  styleUrls: ['./modal-menu-detalle.page.scss'],
})
export class ModalMenuDetallePage implements OnInit {

  @Input()productos:Producto[];
  @Input()idMesa: string;
  @Input()idCliente:string;
  total:number;

  constructor(
    private modalController:ModalController,
    private pedidoService:PedidoService,
  ) {
    this.total = 0;
   }

  ngOnInit() {

    for(let auxProducto of this.productos) {

      this.total += (auxProducto.precio * auxProducto.cantidad);

    }
  }

  async crearPedido() {

    let pedido = new Pedido(this.productos, this.idCliente, this.idMesa);

    await this.pedidoService.createPedido(pedido);

    this.cerrarModal();

  }


  async cerrarModal() {
    await this.modalController.dismiss();
  }


}
