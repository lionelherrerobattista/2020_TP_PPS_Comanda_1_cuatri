import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Pedido } from 'src/app/clases/pedido';
import { Estados } from 'src/app/clases/enums/estados';
import { PedidoService } from 'src/app/servicios/pedido.service';

@Component({
  selector: 'app-modal-detalle-pedido',
  templateUrl: './modal-detalle-pedido.page.html',
  styleUrls: ['./modal-detalle-pedido.page.scss'],
})
export class ModalDetallePedidoPage implements OnInit {

  pedido:Pedido;
  total:number;

  constructor(
    private modalController:ModalController,
    private pedidoService:PedidoService,
    public toastController: ToastController,
  ) {
    this.total = 0;
   }

  ngOnInit() {
    for(let auxProducto of this.pedido.productos) {

      this.total += (auxProducto.precio * auxProducto.cantidad);

    }
  }

  async entregarPedido() {
    this.pedido.estado = Estados.entregado;

    this.pedidoService.updateOrder(this.pedido.id, this.pedido);

    this.mostrarToast('Pedido entregado. Esperando que el cliente lo acepte');

    this.cerrarModal();
  }


  async cerrarModal() {
    await this.modalController.dismiss();
  }


  async mostrarToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

}
